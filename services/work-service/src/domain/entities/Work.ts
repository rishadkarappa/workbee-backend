export interface WorkMediaItem {
  url: string;
  publicId: string;
}

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
    beforeImage?: string;

    images?: WorkMediaItem[]; 
    videos?: WorkMediaItem[]; 

    duration?: string;
    budget?: string;
    location: {
        type: 'Point',
        coordinates: [number, number]
    };
    currentLocation?: string;
    manualAddress?: string;
    landmark?: string;
    contactNumber: string;
    petrolAllowance?: string;
    extraRequirements?: string;
    anythingElse?: string;
    termsAccepted: boolean;
    status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
    progress?: 'started' | 'ongoing' | 'completed';
    workerId?: string;
    createdAt?: Date;
    updatedAt?: Date;

}