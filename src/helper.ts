const BASE_URL = "https://api.ticktick.com/open/v1";
export type Task = {
  id: string;
  projectId: string;
  sortOrder: number;
  title: string;
  content: string;
  timeZone: string;
  isAllDay: boolean;
  priority: number;
  status: number; // Normal: 0, Completed: 2

  completedTime?: string; // only show if we tick the task and retick it
  dueDate?: string;
  repeatFlag?: string;
  startDate?: string;
  tags?: string[];
};

export type Project = {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
  viewMode: string;
  kind: string;
};

export async function getUserProjects(accessToken: string) {
  try {
    const response = await fetch(`${BASE_URL}/project`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return (await response.json()) as Project[];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAllProjectTasks(
  accessToken: string,
  projectId: string,
) {
  try {
    const response = await fetch(`${BASE_URL}/project/${projectId}/data`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = (await response.json()) as {
      project: Project;
      tasks: Task[];
      columns: any[];
    };
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getMultipleProjectTasks(
  accessToken: string,
  projectIds: string[],
) {
  const tasks = await Promise.all(
    projectIds.map((id) => getAllProjectTasks(accessToken, id)),
  );

  const res = tasks
    .filter((t) => t !== null)
    .map((task) => {
      return task.tasks.map((t) => {
        return {
          externalId: t.id,
          taskListId: t.projectId,
          globalUID: `ticktick_${t.id}`,
          externalPriority: t.priority,
          externalOrder: t.sortOrder,
          title: t.title,
          description: t.content,
          createdTime: t.startDate ?? null,
          createdTimeZone: t.timeZone,
          dueTime: t.dueDate ?? null,
          dueTimeZone: t.timeZone,
          isRecurring: t.repeatFlag !== null,
          status: t.status === 0 ? "needsAction" : "completed",
          etag: t.tags ? t.tags.join(",") : null,
        };
      });
    });

  return res.flat();
}
