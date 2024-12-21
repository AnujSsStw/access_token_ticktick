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
  status: number;
  tags: string[];
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
