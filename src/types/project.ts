export type ProjectPrivacy = 'Private' | 'Public' | 'Unlisted';

export interface Project {
    id: number;
    usernameSlug: string;
    projectName: string;
    shortDescription: string;
    privacy: ProjectPrivacy;
}