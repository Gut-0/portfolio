import { profile } from "../data/profile";

export default function Skills() {
  return (
    <section id="skills" className="container section">
      <h2>
        <span className="mono accent">02.</span> Skills
      </h2>
      <div className="skills-grid">
        {profile.skills.map((group) => (
          <div className="card" key={group.group}>
            <h3 className="mono">{group.group}</h3>
            <ul className="tag-list">
              {group.items.map((item) => (
                <li className="tag" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
