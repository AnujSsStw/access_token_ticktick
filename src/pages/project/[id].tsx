import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllProjectTasks, Task } from "~/helper";

export default function Page() {
  const pathname = useParams() as {
    id: string;
  };
  const [projects, setProjects] = useState<Task[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      if (!session || !pathname.id) {
        return;
      }
      const data = await getAllProjectTasks(session?.accessToken!, pathname.id);
      if (!data) {
        return;
      }
      setProjects(data.tasks);
    })();
  }, [session]);

  if (!session) {
    return <div>Sign in first</div>;
  }

  return (
    <div>
      <h1>Page: {}</h1>

      <ul>
        {projects.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
