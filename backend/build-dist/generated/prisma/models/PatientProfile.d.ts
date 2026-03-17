import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type PatientProfileModel = runtime.Types.Result.DefaultSelection<Prisma.$PatientProfilePayload>;
export type AggregatePatientProfile = {
    _count: PatientProfileCountAggregateOutputType | null;
    _min: PatientProfileMinAggregateOutputType | null;
    _max: PatientProfileMaxAggregateOutputType | null;
};
export type PatientProfileMinAggregateOutputType = {
    id: string | null;
    patientId: string | null;
    dateOfBirth: Date | null;
    gender: string | null;
    phone: string | null;
    address: string | null;
    allergies: string | null;
    chronicConditions: string | null;
    currentMedications: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    emergencyContactRelation: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PatientProfileMaxAggregateOutputType = {
    id: string | null;
    patientId: string | null;
    dateOfBirth: Date | null;
    gender: string | null;
    phone: string | null;
    address: string | null;
    allergies: string | null;
    chronicConditions: string | null;
    currentMedications: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    emergencyContactRelation: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PatientProfileCountAggregateOutputType = {
    id: number;
    patientId: number;
    dateOfBirth: number;
    gender: number;
    phone: number;
    address: number;
    allergies: number;
    chronicConditions: number;
    currentMedications: number;
    emergencyContactName: number;
    emergencyContactPhone: number;
    emergencyContactRelation: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PatientProfileMinAggregateInputType = {
    id?: true;
    patientId?: true;
    dateOfBirth?: true;
    gender?: true;
    phone?: true;
    address?: true;
    allergies?: true;
    chronicConditions?: true;
    currentMedications?: true;
    emergencyContactName?: true;
    emergencyContactPhone?: true;
    emergencyContactRelation?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PatientProfileMaxAggregateInputType = {
    id?: true;
    patientId?: true;
    dateOfBirth?: true;
    gender?: true;
    phone?: true;
    address?: true;
    allergies?: true;
    chronicConditions?: true;
    currentMedications?: true;
    emergencyContactName?: true;
    emergencyContactPhone?: true;
    emergencyContactRelation?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PatientProfileCountAggregateInputType = {
    id?: true;
    patientId?: true;
    dateOfBirth?: true;
    gender?: true;
    phone?: true;
    address?: true;
    allergies?: true;
    chronicConditions?: true;
    currentMedications?: true;
    emergencyContactName?: true;
    emergencyContactPhone?: true;
    emergencyContactRelation?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PatientProfileAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PatientProfileWhereInput;
    orderBy?: Prisma.PatientProfileOrderByWithRelationInput | Prisma.PatientProfileOrderByWithRelationInput[];
    cursor?: Prisma.PatientProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PatientProfileCountAggregateInputType;
    _min?: PatientProfileMinAggregateInputType;
    _max?: PatientProfileMaxAggregateInputType;
};
export type GetPatientProfileAggregateType<T extends PatientProfileAggregateArgs> = {
    [P in keyof T & keyof AggregatePatientProfile]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePatientProfile[P]> : Prisma.GetScalarType<T[P], AggregatePatientProfile[P]>;
};
export type PatientProfileGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PatientProfileWhereInput;
    orderBy?: Prisma.PatientProfileOrderByWithAggregationInput | Prisma.PatientProfileOrderByWithAggregationInput[];
    by: Prisma.PatientProfileScalarFieldEnum[] | Prisma.PatientProfileScalarFieldEnum;
    having?: Prisma.PatientProfileScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PatientProfileCountAggregateInputType | true;
    _min?: PatientProfileMinAggregateInputType;
    _max?: PatientProfileMaxAggregateInputType;
};
export type PatientProfileGroupByOutputType = {
    id: string;
    patientId: string;
    dateOfBirth: Date | null;
    gender: string | null;
    phone: string | null;
    address: string | null;
    allergies: string | null;
    chronicConditions: string | null;
    currentMedications: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    emergencyContactRelation: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: PatientProfileCountAggregateOutputType | null;
    _min: PatientProfileMinAggregateOutputType | null;
    _max: PatientProfileMaxAggregateOutputType | null;
};
type GetPatientProfileGroupByPayload<T extends PatientProfileGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PatientProfileGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PatientProfileGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PatientProfileGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PatientProfileGroupByOutputType[P]>;
}>>;
export type PatientProfileWhereInput = {
    AND?: Prisma.PatientProfileWhereInput | Prisma.PatientProfileWhereInput[];
    OR?: Prisma.PatientProfileWhereInput[];
    NOT?: Prisma.PatientProfileWhereInput | Prisma.PatientProfileWhereInput[];
    id?: Prisma.StringFilter<"PatientProfile"> | string;
    patientId?: Prisma.StringFilter<"PatientProfile"> | string;
    dateOfBirth?: Prisma.DateTimeNullableFilter<"PatientProfile"> | Date | string | null;
    gender?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    phone?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    address?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    allergies?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    chronicConditions?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    currentMedications?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    emergencyContactName?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    emergencyContactPhone?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    emergencyContactRelation?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PatientProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PatientProfile"> | Date | string;
    patient?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type PatientProfileOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    dateOfBirth?: Prisma.SortOrderInput | Prisma.SortOrder;
    gender?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    allergies?: Prisma.SortOrderInput | Prisma.SortOrder;
    chronicConditions?: Prisma.SortOrderInput | Prisma.SortOrder;
    currentMedications?: Prisma.SortOrderInput | Prisma.SortOrder;
    emergencyContactName?: Prisma.SortOrderInput | Prisma.SortOrder;
    emergencyContactPhone?: Prisma.SortOrderInput | Prisma.SortOrder;
    emergencyContactRelation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    patient?: Prisma.UserOrderByWithRelationInput;
};
export type PatientProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    patientId?: string;
    AND?: Prisma.PatientProfileWhereInput | Prisma.PatientProfileWhereInput[];
    OR?: Prisma.PatientProfileWhereInput[];
    NOT?: Prisma.PatientProfileWhereInput | Prisma.PatientProfileWhereInput[];
    dateOfBirth?: Prisma.DateTimeNullableFilter<"PatientProfile"> | Date | string | null;
    gender?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    phone?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    address?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    allergies?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    chronicConditions?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    currentMedications?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    emergencyContactName?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    emergencyContactPhone?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    emergencyContactRelation?: Prisma.StringNullableFilter<"PatientProfile"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PatientProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PatientProfile"> | Date | string;
    patient?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "patientId">;
export type PatientProfileOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    dateOfBirth?: Prisma.SortOrderInput | Prisma.SortOrder;
    gender?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    allergies?: Prisma.SortOrderInput | Prisma.SortOrder;
    chronicConditions?: Prisma.SortOrderInput | Prisma.SortOrder;
    currentMedications?: Prisma.SortOrderInput | Prisma.SortOrder;
    emergencyContactName?: Prisma.SortOrderInput | Prisma.SortOrder;
    emergencyContactPhone?: Prisma.SortOrderInput | Prisma.SortOrder;
    emergencyContactRelation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PatientProfileCountOrderByAggregateInput;
    _max?: Prisma.PatientProfileMaxOrderByAggregateInput;
    _min?: Prisma.PatientProfileMinOrderByAggregateInput;
};
export type PatientProfileScalarWhereWithAggregatesInput = {
    AND?: Prisma.PatientProfileScalarWhereWithAggregatesInput | Prisma.PatientProfileScalarWhereWithAggregatesInput[];
    OR?: Prisma.PatientProfileScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PatientProfileScalarWhereWithAggregatesInput | Prisma.PatientProfileScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PatientProfile"> | string;
    patientId?: Prisma.StringWithAggregatesFilter<"PatientProfile"> | string;
    dateOfBirth?: Prisma.DateTimeNullableWithAggregatesFilter<"PatientProfile"> | Date | string | null;
    gender?: Prisma.StringNullableWithAggregatesFilter<"PatientProfile"> | string | null;
    phone?: Prisma.StringNullableWithAggregatesFilter<"PatientProfile"> | string | null;
    address?: Prisma.StringNullableWithAggregatesFilter<"PatientProfile"> | string | null;
    allergies?: Prisma.StringNullableWithAggregatesFilter<"PatientProfile"> | string | null;
    chronicConditions?: Prisma.StringNullableWithAggregatesFilter<"PatientProfile"> | string | null;
    currentMedications?: Prisma.StringNullableWithAggregatesFilter<"PatientProfile"> | string | null;
    emergencyContactName?: Prisma.StringNullableWithAggregatesFilter<"PatientProfile"> | string | null;
    emergencyContactPhone?: Prisma.StringNullableWithAggregatesFilter<"PatientProfile"> | string | null;
    emergencyContactRelation?: Prisma.StringNullableWithAggregatesFilter<"PatientProfile"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PatientProfile"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PatientProfile"> | Date | string;
};
export type PatientProfileCreateInput = {
    id?: string;
    dateOfBirth?: Date | string | null;
    gender?: string | null;
    phone?: string | null;
    address?: string | null;
    allergies?: string | null;
    chronicConditions?: string | null;
    currentMedications?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patient: Prisma.UserCreateNestedOneWithoutPatientProfileInput;
};
export type PatientProfileUncheckedCreateInput = {
    id?: string;
    patientId: string;
    dateOfBirth?: Date | string | null;
    gender?: string | null;
    phone?: string | null;
    address?: string | null;
    allergies?: string | null;
    chronicConditions?: string | null;
    currentMedications?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PatientProfileUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gender?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allergies?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chronicConditions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currentMedications?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactRelation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patient?: Prisma.UserUpdateOneRequiredWithoutPatientProfileNestedInput;
};
export type PatientProfileUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gender?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allergies?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chronicConditions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currentMedications?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactRelation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientProfileCreateManyInput = {
    id?: string;
    patientId: string;
    dateOfBirth?: Date | string | null;
    gender?: string | null;
    phone?: string | null;
    address?: string | null;
    allergies?: string | null;
    chronicConditions?: string | null;
    currentMedications?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PatientProfileUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gender?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allergies?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chronicConditions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currentMedications?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactRelation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientProfileUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gender?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allergies?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chronicConditions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currentMedications?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactRelation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientProfileNullableScalarRelationFilter = {
    is?: Prisma.PatientProfileWhereInput | null;
    isNot?: Prisma.PatientProfileWhereInput | null;
};
export type PatientProfileCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    dateOfBirth?: Prisma.SortOrder;
    gender?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    allergies?: Prisma.SortOrder;
    chronicConditions?: Prisma.SortOrder;
    currentMedications?: Prisma.SortOrder;
    emergencyContactName?: Prisma.SortOrder;
    emergencyContactPhone?: Prisma.SortOrder;
    emergencyContactRelation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PatientProfileMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    dateOfBirth?: Prisma.SortOrder;
    gender?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    allergies?: Prisma.SortOrder;
    chronicConditions?: Prisma.SortOrder;
    currentMedications?: Prisma.SortOrder;
    emergencyContactName?: Prisma.SortOrder;
    emergencyContactPhone?: Prisma.SortOrder;
    emergencyContactRelation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PatientProfileMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    dateOfBirth?: Prisma.SortOrder;
    gender?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    allergies?: Prisma.SortOrder;
    chronicConditions?: Prisma.SortOrder;
    currentMedications?: Prisma.SortOrder;
    emergencyContactName?: Prisma.SortOrder;
    emergencyContactPhone?: Prisma.SortOrder;
    emergencyContactRelation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PatientProfileCreateNestedOneWithoutPatientInput = {
    create?: Prisma.XOR<Prisma.PatientProfileCreateWithoutPatientInput, Prisma.PatientProfileUncheckedCreateWithoutPatientInput>;
    connectOrCreate?: Prisma.PatientProfileCreateOrConnectWithoutPatientInput;
    connect?: Prisma.PatientProfileWhereUniqueInput;
};
export type PatientProfileUncheckedCreateNestedOneWithoutPatientInput = {
    create?: Prisma.XOR<Prisma.PatientProfileCreateWithoutPatientInput, Prisma.PatientProfileUncheckedCreateWithoutPatientInput>;
    connectOrCreate?: Prisma.PatientProfileCreateOrConnectWithoutPatientInput;
    connect?: Prisma.PatientProfileWhereUniqueInput;
};
export type PatientProfileUpdateOneWithoutPatientNestedInput = {
    create?: Prisma.XOR<Prisma.PatientProfileCreateWithoutPatientInput, Prisma.PatientProfileUncheckedCreateWithoutPatientInput>;
    connectOrCreate?: Prisma.PatientProfileCreateOrConnectWithoutPatientInput;
    upsert?: Prisma.PatientProfileUpsertWithoutPatientInput;
    disconnect?: Prisma.PatientProfileWhereInput | boolean;
    delete?: Prisma.PatientProfileWhereInput | boolean;
    connect?: Prisma.PatientProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PatientProfileUpdateToOneWithWhereWithoutPatientInput, Prisma.PatientProfileUpdateWithoutPatientInput>, Prisma.PatientProfileUncheckedUpdateWithoutPatientInput>;
};
export type PatientProfileUncheckedUpdateOneWithoutPatientNestedInput = {
    create?: Prisma.XOR<Prisma.PatientProfileCreateWithoutPatientInput, Prisma.PatientProfileUncheckedCreateWithoutPatientInput>;
    connectOrCreate?: Prisma.PatientProfileCreateOrConnectWithoutPatientInput;
    upsert?: Prisma.PatientProfileUpsertWithoutPatientInput;
    disconnect?: Prisma.PatientProfileWhereInput | boolean;
    delete?: Prisma.PatientProfileWhereInput | boolean;
    connect?: Prisma.PatientProfileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PatientProfileUpdateToOneWithWhereWithoutPatientInput, Prisma.PatientProfileUpdateWithoutPatientInput>, Prisma.PatientProfileUncheckedUpdateWithoutPatientInput>;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type PatientProfileCreateWithoutPatientInput = {
    id?: string;
    dateOfBirth?: Date | string | null;
    gender?: string | null;
    phone?: string | null;
    address?: string | null;
    allergies?: string | null;
    chronicConditions?: string | null;
    currentMedications?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PatientProfileUncheckedCreateWithoutPatientInput = {
    id?: string;
    dateOfBirth?: Date | string | null;
    gender?: string | null;
    phone?: string | null;
    address?: string | null;
    allergies?: string | null;
    chronicConditions?: string | null;
    currentMedications?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PatientProfileCreateOrConnectWithoutPatientInput = {
    where: Prisma.PatientProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.PatientProfileCreateWithoutPatientInput, Prisma.PatientProfileUncheckedCreateWithoutPatientInput>;
};
export type PatientProfileUpsertWithoutPatientInput = {
    update: Prisma.XOR<Prisma.PatientProfileUpdateWithoutPatientInput, Prisma.PatientProfileUncheckedUpdateWithoutPatientInput>;
    create: Prisma.XOR<Prisma.PatientProfileCreateWithoutPatientInput, Prisma.PatientProfileUncheckedCreateWithoutPatientInput>;
    where?: Prisma.PatientProfileWhereInput;
};
export type PatientProfileUpdateToOneWithWhereWithoutPatientInput = {
    where?: Prisma.PatientProfileWhereInput;
    data: Prisma.XOR<Prisma.PatientProfileUpdateWithoutPatientInput, Prisma.PatientProfileUncheckedUpdateWithoutPatientInput>;
};
export type PatientProfileUpdateWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gender?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allergies?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chronicConditions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currentMedications?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactRelation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientProfileUncheckedUpdateWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gender?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    allergies?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    chronicConditions?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currentMedications?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emergencyContactRelation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PatientProfileSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    patientId?: boolean;
    dateOfBirth?: boolean;
    gender?: boolean;
    phone?: boolean;
    address?: boolean;
    allergies?: boolean;
    chronicConditions?: boolean;
    currentMedications?: boolean;
    emergencyContactName?: boolean;
    emergencyContactPhone?: boolean;
    emergencyContactRelation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    patient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["patientProfile"]>;
export type PatientProfileSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    patientId?: boolean;
    dateOfBirth?: boolean;
    gender?: boolean;
    phone?: boolean;
    address?: boolean;
    allergies?: boolean;
    chronicConditions?: boolean;
    currentMedications?: boolean;
    emergencyContactName?: boolean;
    emergencyContactPhone?: boolean;
    emergencyContactRelation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    patient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["patientProfile"]>;
export type PatientProfileSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    patientId?: boolean;
    dateOfBirth?: boolean;
    gender?: boolean;
    phone?: boolean;
    address?: boolean;
    allergies?: boolean;
    chronicConditions?: boolean;
    currentMedications?: boolean;
    emergencyContactName?: boolean;
    emergencyContactPhone?: boolean;
    emergencyContactRelation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    patient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["patientProfile"]>;
export type PatientProfileSelectScalar = {
    id?: boolean;
    patientId?: boolean;
    dateOfBirth?: boolean;
    gender?: boolean;
    phone?: boolean;
    address?: boolean;
    allergies?: boolean;
    chronicConditions?: boolean;
    currentMedications?: boolean;
    emergencyContactName?: boolean;
    emergencyContactPhone?: boolean;
    emergencyContactRelation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PatientProfileOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "patientId" | "dateOfBirth" | "gender" | "phone" | "address" | "allergies" | "chronicConditions" | "currentMedications" | "emergencyContactName" | "emergencyContactPhone" | "emergencyContactRelation" | "createdAt" | "updatedAt", ExtArgs["result"]["patientProfile"]>;
export type PatientProfileInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PatientProfileIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PatientProfileIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $PatientProfilePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PatientProfile";
    objects: {
        patient: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        patientId: string;
        dateOfBirth: Date | null;
        gender: string | null;
        phone: string | null;
        address: string | null;
        allergies: string | null;
        chronicConditions: string | null;
        currentMedications: string | null;
        emergencyContactName: string | null;
        emergencyContactPhone: string | null;
        emergencyContactRelation: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["patientProfile"]>;
    composites: {};
};
export type PatientProfileGetPayload<S extends boolean | null | undefined | PatientProfileDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload, S>;
export type PatientProfileCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PatientProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PatientProfileCountAggregateInputType | true;
};
export interface PatientProfileDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PatientProfile'];
        meta: {
            name: 'PatientProfile';
        };
    };
    findUnique<T extends PatientProfileFindUniqueArgs>(args: Prisma.SelectSubset<T, PatientProfileFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PatientProfileClient<runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PatientProfileFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PatientProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PatientProfileClient<runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PatientProfileFindFirstArgs>(args?: Prisma.SelectSubset<T, PatientProfileFindFirstArgs<ExtArgs>>): Prisma.Prisma__PatientProfileClient<runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PatientProfileFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PatientProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PatientProfileClient<runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PatientProfileFindManyArgs>(args?: Prisma.SelectSubset<T, PatientProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PatientProfileCreateArgs>(args: Prisma.SelectSubset<T, PatientProfileCreateArgs<ExtArgs>>): Prisma.Prisma__PatientProfileClient<runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PatientProfileCreateManyArgs>(args?: Prisma.SelectSubset<T, PatientProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PatientProfileCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PatientProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PatientProfileDeleteArgs>(args: Prisma.SelectSubset<T, PatientProfileDeleteArgs<ExtArgs>>): Prisma.Prisma__PatientProfileClient<runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PatientProfileUpdateArgs>(args: Prisma.SelectSubset<T, PatientProfileUpdateArgs<ExtArgs>>): Prisma.Prisma__PatientProfileClient<runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PatientProfileDeleteManyArgs>(args?: Prisma.SelectSubset<T, PatientProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PatientProfileUpdateManyArgs>(args: Prisma.SelectSubset<T, PatientProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PatientProfileUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PatientProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PatientProfileUpsertArgs>(args: Prisma.SelectSubset<T, PatientProfileUpsertArgs<ExtArgs>>): Prisma.Prisma__PatientProfileClient<runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PatientProfileCountArgs>(args?: Prisma.Subset<T, PatientProfileCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PatientProfileCountAggregateOutputType> : number>;
    aggregate<T extends PatientProfileAggregateArgs>(args: Prisma.Subset<T, PatientProfileAggregateArgs>): Prisma.PrismaPromise<GetPatientProfileAggregateType<T>>;
    groupBy<T extends PatientProfileGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PatientProfileGroupByArgs['orderBy'];
    } : {
        orderBy?: PatientProfileGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PatientProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PatientProfileFieldRefs;
}
export interface Prisma__PatientProfileClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    patient<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PatientProfileFieldRefs {
    readonly id: Prisma.FieldRef<"PatientProfile", 'String'>;
    readonly patientId: Prisma.FieldRef<"PatientProfile", 'String'>;
    readonly dateOfBirth: Prisma.FieldRef<"PatientProfile", 'DateTime'>;
    readonly gender: Prisma.FieldRef<"PatientProfile", 'String'>;
    readonly phone: Prisma.FieldRef<"PatientProfile", 'String'>;
    readonly address: Prisma.FieldRef<"PatientProfile", 'String'>;
    readonly allergies: Prisma.FieldRef<"PatientProfile", 'String'>;
    readonly chronicConditions: Prisma.FieldRef<"PatientProfile", 'String'>;
    readonly currentMedications: Prisma.FieldRef<"PatientProfile", 'String'>;
    readonly emergencyContactName: Prisma.FieldRef<"PatientProfile", 'String'>;
    readonly emergencyContactPhone: Prisma.FieldRef<"PatientProfile", 'String'>;
    readonly emergencyContactRelation: Prisma.FieldRef<"PatientProfile", 'String'>;
    readonly createdAt: Prisma.FieldRef<"PatientProfile", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"PatientProfile", 'DateTime'>;
}
export type PatientProfileFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelect<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    include?: Prisma.PatientProfileInclude<ExtArgs> | null;
    where: Prisma.PatientProfileWhereUniqueInput;
};
export type PatientProfileFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelect<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    include?: Prisma.PatientProfileInclude<ExtArgs> | null;
    where: Prisma.PatientProfileWhereUniqueInput;
};
export type PatientProfileFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelect<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    include?: Prisma.PatientProfileInclude<ExtArgs> | null;
    where?: Prisma.PatientProfileWhereInput;
    orderBy?: Prisma.PatientProfileOrderByWithRelationInput | Prisma.PatientProfileOrderByWithRelationInput[];
    cursor?: Prisma.PatientProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PatientProfileScalarFieldEnum | Prisma.PatientProfileScalarFieldEnum[];
};
export type PatientProfileFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelect<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    include?: Prisma.PatientProfileInclude<ExtArgs> | null;
    where?: Prisma.PatientProfileWhereInput;
    orderBy?: Prisma.PatientProfileOrderByWithRelationInput | Prisma.PatientProfileOrderByWithRelationInput[];
    cursor?: Prisma.PatientProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PatientProfileScalarFieldEnum | Prisma.PatientProfileScalarFieldEnum[];
};
export type PatientProfileFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelect<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    include?: Prisma.PatientProfileInclude<ExtArgs> | null;
    where?: Prisma.PatientProfileWhereInput;
    orderBy?: Prisma.PatientProfileOrderByWithRelationInput | Prisma.PatientProfileOrderByWithRelationInput[];
    cursor?: Prisma.PatientProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PatientProfileScalarFieldEnum | Prisma.PatientProfileScalarFieldEnum[];
};
export type PatientProfileCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelect<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    include?: Prisma.PatientProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PatientProfileCreateInput, Prisma.PatientProfileUncheckedCreateInput>;
};
export type PatientProfileCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PatientProfileCreateManyInput | Prisma.PatientProfileCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PatientProfileCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    data: Prisma.PatientProfileCreateManyInput | Prisma.PatientProfileCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PatientProfileIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PatientProfileUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelect<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    include?: Prisma.PatientProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PatientProfileUpdateInput, Prisma.PatientProfileUncheckedUpdateInput>;
    where: Prisma.PatientProfileWhereUniqueInput;
};
export type PatientProfileUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PatientProfileUpdateManyMutationInput, Prisma.PatientProfileUncheckedUpdateManyInput>;
    where?: Prisma.PatientProfileWhereInput;
    limit?: number;
};
export type PatientProfileUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PatientProfileUpdateManyMutationInput, Prisma.PatientProfileUncheckedUpdateManyInput>;
    where?: Prisma.PatientProfileWhereInput;
    limit?: number;
    include?: Prisma.PatientProfileIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PatientProfileUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelect<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    include?: Prisma.PatientProfileInclude<ExtArgs> | null;
    where: Prisma.PatientProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.PatientProfileCreateInput, Prisma.PatientProfileUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PatientProfileUpdateInput, Prisma.PatientProfileUncheckedUpdateInput>;
};
export type PatientProfileDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelect<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    include?: Prisma.PatientProfileInclude<ExtArgs> | null;
    where: Prisma.PatientProfileWhereUniqueInput;
};
export type PatientProfileDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PatientProfileWhereInput;
    limit?: number;
};
export type PatientProfileDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelect<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    include?: Prisma.PatientProfileInclude<ExtArgs> | null;
};
export {};
