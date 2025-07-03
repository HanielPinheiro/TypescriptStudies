export interface Creator {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    bannerImage: string;
    bio: string;
    subscriptionPrice: number;
    subscriberCount: number;
    postCount: number;
    mediaCount: number;
    isOnline: boolean;
}

export interface ContentPost {
    id: string;
    creatorId: string;
    creatorUsername: string;
    creatorAvatar: string;
    text?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    likeCount: number;
    commentCount: number;
    createdAt: string;
    isPaid: boolean;
    price?: number;
}

export interface CreatorStats {
    totalEarnings: number;
    subscriberCount: number;
    subscriberChange: number;
    engagementRate: number;
    recentTransactions: {
        id: string;
        date: string;
        subscriber: string;
        amount: number;
        type: string;
    }[];
}

export interface Profile {
    id: string
    username: string
    displayName: string
    avatar: string
    bio: string
    subscriberCount: number
    subscriptionPrice?: number
    isCreator?: boolean
    bannerImage?: string
    postCount?: number
    mediaCount?: number
}

export interface AuthFormData {
    email: string
    password: string
    username?: string
}