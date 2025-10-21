export interface Worker {
    id?:string;
    name:string;
    email:string;
    phone:string;
    password:string;
    location:string;
    workType:string;
    preferredWorks:string[];
    confirmations:{
        reliable:boolean;
        honest:boolean;
        termsAccepted:boolean;
    };
    isApproved?:boolean;
    createdAt?:Date;
    updatedAt?:Date;
}