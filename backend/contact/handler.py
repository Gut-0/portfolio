"""Contact form endpoint: validates the payload and stores it in DynamoDB."""

import json
import os
import re
import uuid
from datetime import datetime, timezone

import boto3

TABLE_NAME = os.environ["TABLE_NAME"]

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MAX_LENGTHS = {"name": 120, "email": 254, "message": 4000}

_table = boto3.resource("dynamodb").Table(TABLE_NAME)


def _response(status: int, body: dict) -> dict:
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def _validate(payload: dict) -> str | None:
    for field, max_len in MAX_LENGTHS.items():
        value = payload.get(field)
        if not isinstance(value, str) or not value.strip():
            return f"'{field}' is required"
        if len(value) > max_len:
            return f"'{field}' must be at most {max_len} characters"
    if not EMAIL_RE.match(payload["email"]):
        return "'email' is not a valid address"
    return None


def lambda_handler(event, _context):
    try:
        payload = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return _response(400, {"error": "request body must be valid JSON"})

    error = _validate(payload)
    if error:
        return _response(400, {"error": error})

    _table.put_item(
        Item={
            "pk": "MESSAGE",
            "sk": f"{datetime.now(timezone.utc).isoformat()}#{uuid.uuid4().hex[:8]}",
            "name": payload["name"].strip(),
            "email": payload["email"].strip(),
            "message": payload["message"].strip(),
        }
    )
    return _response(201, {"ok": True})
