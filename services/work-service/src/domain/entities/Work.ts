export interface Work {
    id?: string;
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
    location:{
        type:'Point',
        coordinates:[number, number]
    };
    currentLocation?: string;
    manualAddress?: string;
    landmark?: string;
    place?: string;
    contactNumber: string;
    beforeImage?: string;
    petrolAllowance?: string;
    extraRequirements?: string;
    anythingElse?: string;
    termsAccepted: boolean;
    status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
    createdAt?: Date;
    updatedAt?: Date;
}