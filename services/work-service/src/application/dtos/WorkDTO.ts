export interface PostWorkDto {
    userId: string;
    workTitle: string;
    workCategory: string;
    workType: 'oneDay' | 'multipleDay';
    date?: string;
    startDate?: string;
    endDate?: string;
    time: string;
    description: string;
    duration?: string;
    budget?: string;
    latitude: number;
    longitude: number;
    currentLocation?: string;
    manualAddress?: string;
    landmark?: string;
    contactNumber: string;
    petrolAllowance?: string;
    extraRequirements?: string;
    anythingElse?: string;
    termsAccepted: boolean;
}

export interface WorkResponseDto {
    id: string;
    userId: string;
    workTitle: string;
    workCategory: string;
    workType: 'oneDay' | 'multipleDay';
    date?: string;
    startDate?: string;
    endDate?: string;
    time: string;
    description: string;
    voiceFile?: string;
    videoFile?: string;
    duration?: string;
    budget?: string;
    currentLocation?: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    distance?: number; 
    manualAddress?: string;
    landmark?: string;
    contactNumber: string;
    beforeImage?: string;
    petrolAllowance?: string;
    extraRequirements?: string;
    anythingElse?: string;
    status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateWorkDto {
    workId: string;
    userId: string;
    workTitle?: string;
    workCategory?: string;
    workType?: 'oneDay' | 'multipleDay';
    date?: string;
    startDate?: string;
    endDate?: string;
    time?: string;
    description?: string;
    duration?: string;
    budget?: string;
    manualAddress?: string;
    landmark?: string;
    contactNumber?: string;
    petrolAllowance?: string;
    extraRequirements?: string;
    anythingElse?: string;
    status?: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
}

export interface DeleteWorkDto {
    workId: string;
    userId: string;
}
