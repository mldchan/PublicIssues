export type ProjectPrivacy = 'Private' | 'Public' | 'Unlisted';

export interface ProjectExtended {
    privacy: ProjectPrivacy;
    allowIssues: boolean;
}

export interface ProjectBase {
    id: number;
    usernameSlug: string;
    projectName: string;
    shortDescription: string;
}

export type Project = ProjectBase & ProjectExtended;
