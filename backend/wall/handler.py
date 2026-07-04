"""Visitor-wall API: GET /notes, POST /notes, DELETE /notes/{id}.

Notes are partitioned by ISO week (pk = week key), so the Monday-00:00-UTC
reset is just "a new week key"; a DynamoDB TTL sweeps old weeks away.
Visitor identity is a client-generated id sent as the x-visitor-id header —
best-effort by design (documented trade-off), but enforced server-side as
one note per (week, visitor).
"""

import json
import os
import random
import uuid
from datetime import datetime, timezone
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key

TABLE_NAME = os.environ["TABLE_NAME"]

WALL_LIMIT = 37
TTL_DAYS = 21
PALETTE = {"#fdec8a", "#ffd6c9", "#cfeede", "#d6e4ff", "#ece0ff", "#fff0b0", "#ffe0ea"}
MAX_NAME_LEN = 60
MAX_FLAG_LEN = 8

_table = boto3.resource("dynamodb").Table(TABLE_NAME)


def _week_key(now: datetime) -> str:
    year, week, _ = now.isocalendar()
    return f"{year}-W{week:02d}"


def _response(status: int, body) -> dict:
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def _public(item: dict) -> dict:
    return {
        "id": item["sk"],
        "week": item["pk"],
        "name": item["name"],
        "flag": item["flag"],
        "color": item["color"],
        "rot": float(item["rot"]),
        "ts": int(item["ts"]),
    }


def _week_items(week: str) -> list[dict]:
    result = _table.query(KeyConditionExpression=Key("pk").eq(week))
    return sorted(result["Items"], key=lambda i: int(i["ts"]), reverse=True)


def _visitor_id(event: dict) -> str | None:
    vid = (event.get("headers") or {}).get("x-visitor-id", "").strip()
    return vid if 8 <= len(vid) <= 64 else None


def get_notes(week: str) -> dict:
    notes = [_public(i) for i in _week_items(week)]
    return _response(200, {"week": week, "limit": WALL_LIMIT, "notes": notes})


def post_note(event: dict, week: str, now: datetime) -> dict:
    visitor = _visitor_id(event)
    if not visitor:
        return _response(400, {"error": "missing x-visitor-id header"})

    try:
        payload = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return _response(400, {"error": "request body must be valid JSON"})

    name = payload.get("name")
    flag = payload.get("flag")
    color = payload.get("color")
    if not isinstance(name, str) or not (0 < len(name.strip()) <= MAX_NAME_LEN):
        return _response(400, {"error": "'name' is required"})
    if not isinstance(flag, str) or not (0 < len(flag) <= MAX_FLAG_LEN):
        return _response(400, {"error": "'flag' is required"})
    if color not in PALETTE:
        return _response(400, {"error": "'color' must be one of the note palette"})

    items = _week_items(week)
    if len(items) >= WALL_LIMIT:
        return _response(409, {"error": "the wall is full this week"})
    if any(i.get("visitor_id") == visitor for i in items):
        return _response(409, {"error": "one note per visitor per week"})

    item = {
        "pk": week,
        "sk": uuid.uuid4().hex[:12],
        "name": name.strip(),
        "flag": flag,
        "color": color,
        "rot": Decimal(str(round(random.uniform(-4, 4), 1))),
        "ts": int(now.timestamp() * 1000),
        "visitor_id": visitor,
        "expires_at": int(now.timestamp()) + TTL_DAYS * 86400,
    }
    _table.put_item(Item=item)
    return _response(201, _public(item))


def delete_note(event: dict, week: str) -> dict:
    visitor = _visitor_id(event)
    if not visitor:
        return _response(400, {"error": "missing x-visitor-id header"})

    note_id = (event.get("pathParameters") or {}).get("id", "")
    existing = _table.get_item(Key={"pk": week, "sk": note_id}).get("Item")
    if not existing:
        return _response(404, {"error": "note not found"})
    if existing.get("visitor_id") != visitor:
        return _response(403, {"error": "you can only delete your own note"})

    _table.delete_item(Key={"pk": week, "sk": note_id})
    return _response(200, {"ok": True})


def lambda_handler(event, _context):
    now = datetime.now(timezone.utc)
    week = _week_key(now)
    route = event.get("routeKey", "")

    if route == "GET /notes":
        return get_notes(week)
    if route == "POST /notes":
        return post_note(event, week, now)
    if route == "DELETE /notes/{id}":
        return delete_note(event, week)
    return _response(404, {"error": "not found"})
