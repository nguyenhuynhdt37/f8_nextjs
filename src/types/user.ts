export interface User {
    id: number;
    fullName: string;
    email: string;
    avatar?: string;
    isActive: number;
    role: string;
    roleId?: number;
    createdAt: string;
    updatedAt?: string;
    bio?: string;
    userName?: string;
    personalWebsite?: string;
    githubLink?: string;
    youtubeLink?: string;
    facebookLink?: string;
}

export interface CreateUserDto {
    fullName: string;
    email: string;
    password: string;
    isActive: number;
    roleId: number;
}

export interface UpdateUserDto {
    fullName?: string;
    userName?: string;
    bio?: string;
    personalWebsite?: string;
    githubLink?: string;
    youtubeLink?: string;
    facebookLink?: string;
    password?: string;
    roleId: number;
    isActive?: number;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface NotificationMessage {
    title: string;
    message: string;
    userId: number;
    entityType?: string;
    entityId?: string;
    dataId?: number;
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    entityType?: string;
    entityId?: string;
    dataId?: number;
    createdAt: string;
    timeAgo: string;
    extraData?: any;
}

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    totalPage: number;
    pageNumber: number;
    pageSize: number;
} 