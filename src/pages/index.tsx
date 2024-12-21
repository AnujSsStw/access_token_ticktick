import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { getMultipleProjectTasks, getUserProjects, Project } from "~/helper";

export default function Home() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);

  const [d, setD] = useState<any>(null);

  return (
    <div>
      <nav>
        {!session ? (
          <button onClick={() => signIn("ticktick")}>Sign in</button>
        ) : (
          <button onClick={() => signOut()}>Sign out</button>
        )}
      </nav>
      <button
        className="rounded bg-slate-600 p-4"
        onClick={async () => {
          if (!session) {
            alert("You need to sign in first");
            return;
          }
          const data = await getUserProjects(session.accessToken!);
          if (!data) {
            alert("Failed to fetch projects");
            return;
          }
          setProjects(data);
        }}
      >
        List all projects
      </button>
      {projects.map((project) => (
        <div key={project.id}>
          <Link className="flex gap-2" href={`/project/${project.id}`}>
            <div>Project name: {project.name}</div>
            <div>id: {project.id}</div>
          </Link>
        </div>
      ))}

      <button
        className="mt-3 block rounded bg-slate-600 p-4"
        onClick={async () => {
          if (!session) {
            alert("You need to sign in first");
            return;
          }
          if (projects.length === 0) {
            alert(
              "You need to fetch projects first. Click on 'List all projects'",
            );
            return;
          }
          const data = await getMultipleProjectTasks(
            session.accessToken!,
            projects.map((p) => p.id),
          );
          setD(data);
        }}
      >
        Get all project data
      </button>
      {d && <pre>{JSON.stringify(d, null, 2)}</pre>}
    </div>
  );
}
