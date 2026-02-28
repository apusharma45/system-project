import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type PrescriptionModel = runtime.Types.Result.DefaultSelection<Prisma.$PrescriptionPayload>;
export type AggregatePrescription = {
    _count: PrescriptionCountAggregateOutputType | null;
    _min: PrescriptionMinAggregateOutputType | null;
    _max: PrescriptionMaxAggregateOutputType | null;
};
export type PrescriptionMinAggregateOutputType = {
    id: string | null;
    appointmentId: string | null;
    doctorId: string | null;
    pharmacyId: string | null;
    notes: string | null;
    status: $Enums.PrescriptionStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PrescriptionMaxAggregateOutputType = {
    id: string | null;
    appointmentId: string | null;
    doctorId: string | null;
    pharmacyId: string | null;
    notes: string | null;
    status: $Enums.PrescriptionStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PrescriptionCountAggregateOutputType = {
    id: number;
    appointmentId: number;
    doctorId: number;
    pharmacyId: number;
    notes: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PrescriptionMinAggregateInputType = {
    id?: true;
    appointmentId?: true;
    doctorId?: true;
    pharmacyId?: true;
    notes?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PrescriptionMaxAggregateInputType = {
    id?: true;
    appointmentId?: true;
    doctorId?: true;
    pharmacyId?: true;
    notes?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PrescriptionCountAggregateInputType = {
    id?: true;
    appointmentId?: true;
    doctorId?: true;
    pharmacyId?: true;
    notes?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PrescriptionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PrescriptionWhereInput;
    orderBy?: Prisma.PrescriptionOrderByWithRelationInput | Prisma.PrescriptionOrderByWithRelationInput[];
    cursor?: Prisma.PrescriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PrescriptionCountAggregateInputType;
    _min?: PrescriptionMinAggregateInputType;
    _max?: PrescriptionMaxAggregateInputType;
};
export type GetPrescriptionAggregateType<T extends PrescriptionAggregateArgs> = {
    [P in keyof T & keyof AggregatePrescription]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePrescription[P]> : Prisma.GetScalarType<T[P], AggregatePrescription[P]>;
};
export type PrescriptionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PrescriptionWhereInput;
    orderBy?: Prisma.PrescriptionOrderByWithAggregationInput | Prisma.PrescriptionOrderByWithAggregationInput[];
    by: Prisma.PrescriptionScalarFieldEnum[] | Prisma.PrescriptionScalarFieldEnum;
    having?: Prisma.PrescriptionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PrescriptionCountAggregateInputType | true;
    _min?: PrescriptionMinAggregateInputType;
    _max?: PrescriptionMaxAggregateInputType;
};
export type PrescriptionGroupByOutputType = {
    id: string;
    appointmentId: string;
    doctorId: string;
    pharmacyId: string;
    notes: string;
    status: $Enums.PrescriptionStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: PrescriptionCountAggregateOutputType | null;
    _min: PrescriptionMinAggregateOutputType | null;
    _max: PrescriptionMaxAggregateOutputType | null;
};
type GetPrescriptionGroupByPayload<T extends PrescriptionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PrescriptionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PrescriptionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PrescriptionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PrescriptionGroupByOutputType[P]>;
}>>;
export type PrescriptionWhereInput = {
    AND?: Prisma.PrescriptionWhereInput | Prisma.PrescriptionWhereInput[];
    OR?: Prisma.PrescriptionWhereInput[];
    NOT?: Prisma.PrescriptionWhereInput | Prisma.PrescriptionWhereInput[];
    id?: Prisma.StringFilter<"Prescription"> | string;
    appointmentId?: Prisma.StringFilter<"Prescription"> | string;
    doctorId?: Prisma.StringFilter<"Prescription"> | string;
    pharmacyId?: Prisma.StringFilter<"Prescription"> | string;
    notes?: Prisma.StringFilter<"Prescription"> | string;
    status?: Prisma.EnumPrescriptionStatusFilter<"Prescription"> | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFilter<"Prescription"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Prescription"> | Date | string;
    appointment?: Prisma.XOR<Prisma.AppointmentScalarRelationFilter, Prisma.AppointmentWhereInput>;
    doctor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    pharmacy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type PrescriptionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    appointmentId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    pharmacyId?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    appointment?: Prisma.AppointmentOrderByWithRelationInput;
    doctor?: Prisma.UserOrderByWithRelationInput;
    pharmacy?: Prisma.UserOrderByWithRelationInput;
};
export type PrescriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    appointmentId?: string;
    AND?: Prisma.PrescriptionWhereInput | Prisma.PrescriptionWhereInput[];
    OR?: Prisma.PrescriptionWhereInput[];
    NOT?: Prisma.PrescriptionWhereInput | Prisma.PrescriptionWhereInput[];
    doctorId?: Prisma.StringFilter<"Prescription"> | string;
    pharmacyId?: Prisma.StringFilter<"Prescription"> | string;
    notes?: Prisma.StringFilter<"Prescription"> | string;
    status?: Prisma.EnumPrescriptionStatusFilter<"Prescription"> | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFilter<"Prescription"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Prescription"> | Date | string;
    appointment?: Prisma.XOR<Prisma.AppointmentScalarRelationFilter, Prisma.AppointmentWhereInput>;
    doctor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    pharmacy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "appointmentId">;
export type PrescriptionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    appointmentId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    pharmacyId?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PrescriptionCountOrderByAggregateInput;
    _max?: Prisma.PrescriptionMaxOrderByAggregateInput;
    _min?: Prisma.PrescriptionMinOrderByAggregateInput;
};
export type PrescriptionScalarWhereWithAggregatesInput = {
    AND?: Prisma.PrescriptionScalarWhereWithAggregatesInput | Prisma.PrescriptionScalarWhereWithAggregatesInput[];
    OR?: Prisma.PrescriptionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PrescriptionScalarWhereWithAggregatesInput | Prisma.PrescriptionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Prescription"> | string;
    appointmentId?: Prisma.StringWithAggregatesFilter<"Prescription"> | string;
    doctorId?: Prisma.StringWithAggregatesFilter<"Prescription"> | string;
    pharmacyId?: Prisma.StringWithAggregatesFilter<"Prescription"> | string;
    notes?: Prisma.StringWithAggregatesFilter<"Prescription"> | string;
    status?: Prisma.EnumPrescriptionStatusWithAggregatesFilter<"Prescription"> | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Prescription"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Prescription"> | Date | string;
};
export type PrescriptionCreateInput = {
    id?: string;
    notes: string;
    status?: $Enums.PrescriptionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    appointment: Prisma.AppointmentCreateNestedOneWithoutPrescriptionInput;
    doctor: Prisma.UserCreateNestedOneWithoutDoctorPrescriptionsInput;
    pharmacy: Prisma.UserCreateNestedOneWithoutPharmacyPrescriptionsInput;
};
export type PrescriptionUncheckedCreateInput = {
    id?: string;
    appointmentId: string;
    doctorId: string;
    pharmacyId: string;
    notes: string;
    status?: $Enums.PrescriptionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PrescriptionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    appointment?: Prisma.AppointmentUpdateOneRequiredWithoutPrescriptionNestedInput;
    doctor?: Prisma.UserUpdateOneRequiredWithoutDoctorPrescriptionsNestedInput;
    pharmacy?: Prisma.UserUpdateOneRequiredWithoutPharmacyPrescriptionsNestedInput;
};
export type PrescriptionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    appointmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    pharmacyId?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PrescriptionCreateManyInput = {
    id?: string;
    appointmentId: string;
    doctorId: string;
    pharmacyId: string;
    notes: string;
    status?: $Enums.PrescriptionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PrescriptionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PrescriptionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    appointmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    pharmacyId?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PrescriptionListRelationFilter = {
    every?: Prisma.PrescriptionWhereInput;
    some?: Prisma.PrescriptionWhereInput;
    none?: Prisma.PrescriptionWhereInput;
};
export type PrescriptionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PrescriptionNullableScalarRelationFilter = {
    is?: Prisma.PrescriptionWhereInput | null;
    isNot?: Prisma.PrescriptionWhereInput | null;
};
export type PrescriptionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    appointmentId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    pharmacyId?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PrescriptionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    appointmentId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    pharmacyId?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PrescriptionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    appointmentId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    pharmacyId?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PrescriptionCreateNestedManyWithoutDoctorInput = {
    create?: Prisma.XOR<Prisma.PrescriptionCreateWithoutDoctorInput, Prisma.PrescriptionUncheckedCreateWithoutDoctorInput> | Prisma.PrescriptionCreateWithoutDoctorInput[] | Prisma.PrescriptionUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.PrescriptionCreateOrConnectWithoutDoctorInput | Prisma.PrescriptionCreateOrConnectWithoutDoctorInput[];
    createMany?: Prisma.PrescriptionCreateManyDoctorInputEnvelope;
    connect?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
};
export type PrescriptionCreateNestedManyWithoutPharmacyInput = {
    create?: Prisma.XOR<Prisma.PrescriptionCreateWithoutPharmacyInput, Prisma.PrescriptionUncheckedCreateWithoutPharmacyInput> | Prisma.PrescriptionCreateWithoutPharmacyInput[] | Prisma.PrescriptionUncheckedCreateWithoutPharmacyInput[];
    connectOrCreate?: Prisma.PrescriptionCreateOrConnectWithoutPharmacyInput | Prisma.PrescriptionCreateOrConnectWithoutPharmacyInput[];
    createMany?: Prisma.PrescriptionCreateManyPharmacyInputEnvelope;
    connect?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
};
export type PrescriptionUncheckedCreateNestedManyWithoutDoctorInput = {
    create?: Prisma.XOR<Prisma.PrescriptionCreateWithoutDoctorInput, Prisma.PrescriptionUncheckedCreateWithoutDoctorInput> | Prisma.PrescriptionCreateWithoutDoctorInput[] | Prisma.PrescriptionUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.PrescriptionCreateOrConnectWithoutDoctorInput | Prisma.PrescriptionCreateOrConnectWithoutDoctorInput[];
    createMany?: Prisma.PrescriptionCreateManyDoctorInputEnvelope;
    connect?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
};
export type PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput = {
    create?: Prisma.XOR<Prisma.PrescriptionCreateWithoutPharmacyInput, Prisma.PrescriptionUncheckedCreateWithoutPharmacyInput> | Prisma.PrescriptionCreateWithoutPharmacyInput[] | Prisma.PrescriptionUncheckedCreateWithoutPharmacyInput[];
    connectOrCreate?: Prisma.PrescriptionCreateOrConnectWithoutPharmacyInput | Prisma.PrescriptionCreateOrConnectWithoutPharmacyInput[];
    createMany?: Prisma.PrescriptionCreateManyPharmacyInputEnvelope;
    connect?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
};
export type PrescriptionUpdateManyWithoutDoctorNestedInput = {
    create?: Prisma.XOR<Prisma.PrescriptionCreateWithoutDoctorInput, Prisma.PrescriptionUncheckedCreateWithoutDoctorInput> | Prisma.PrescriptionCreateWithoutDoctorInput[] | Prisma.PrescriptionUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.PrescriptionCreateOrConnectWithoutDoctorInput | Prisma.PrescriptionCreateOrConnectWithoutDoctorInput[];
    upsert?: Prisma.PrescriptionUpsertWithWhereUniqueWithoutDoctorInput | Prisma.PrescriptionUpsertWithWhereUniqueWithoutDoctorInput[];
    createMany?: Prisma.PrescriptionCreateManyDoctorInputEnvelope;
    set?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    disconnect?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    delete?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    connect?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    update?: Prisma.PrescriptionUpdateWithWhereUniqueWithoutDoctorInput | Prisma.PrescriptionUpdateWithWhereUniqueWithoutDoctorInput[];
    updateMany?: Prisma.PrescriptionUpdateManyWithWhereWithoutDoctorInput | Prisma.PrescriptionUpdateManyWithWhereWithoutDoctorInput[];
    deleteMany?: Prisma.PrescriptionScalarWhereInput | Prisma.PrescriptionScalarWhereInput[];
};
export type PrescriptionUpdateManyWithoutPharmacyNestedInput = {
    create?: Prisma.XOR<Prisma.PrescriptionCreateWithoutPharmacyInput, Prisma.PrescriptionUncheckedCreateWithoutPharmacyInput> | Prisma.PrescriptionCreateWithoutPharmacyInput[] | Prisma.PrescriptionUncheckedCreateWithoutPharmacyInput[];
    connectOrCreate?: Prisma.PrescriptionCreateOrConnectWithoutPharmacyInput | Prisma.PrescriptionCreateOrConnectWithoutPharmacyInput[];
    upsert?: Prisma.PrescriptionUpsertWithWhereUniqueWithoutPharmacyInput | Prisma.PrescriptionUpsertWithWhereUniqueWithoutPharmacyInput[];
    createMany?: Prisma.PrescriptionCreateManyPharmacyInputEnvelope;
    set?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    disconnect?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    delete?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    connect?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    update?: Prisma.PrescriptionUpdateWithWhereUniqueWithoutPharmacyInput | Prisma.PrescriptionUpdateWithWhereUniqueWithoutPharmacyInput[];
    updateMany?: Prisma.PrescriptionUpdateManyWithWhereWithoutPharmacyInput | Prisma.PrescriptionUpdateManyWithWhereWithoutPharmacyInput[];
    deleteMany?: Prisma.PrescriptionScalarWhereInput | Prisma.PrescriptionScalarWhereInput[];
};
export type PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput = {
    create?: Prisma.XOR<Prisma.PrescriptionCreateWithoutDoctorInput, Prisma.PrescriptionUncheckedCreateWithoutDoctorInput> | Prisma.PrescriptionCreateWithoutDoctorInput[] | Prisma.PrescriptionUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.PrescriptionCreateOrConnectWithoutDoctorInput | Prisma.PrescriptionCreateOrConnectWithoutDoctorInput[];
    upsert?: Prisma.PrescriptionUpsertWithWhereUniqueWithoutDoctorInput | Prisma.PrescriptionUpsertWithWhereUniqueWithoutDoctorInput[];
    createMany?: Prisma.PrescriptionCreateManyDoctorInputEnvelope;
    set?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    disconnect?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    delete?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    connect?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    update?: Prisma.PrescriptionUpdateWithWhereUniqueWithoutDoctorInput | Prisma.PrescriptionUpdateWithWhereUniqueWithoutDoctorInput[];
    updateMany?: Prisma.PrescriptionUpdateManyWithWhereWithoutDoctorInput | Prisma.PrescriptionUpdateManyWithWhereWithoutDoctorInput[];
    deleteMany?: Prisma.PrescriptionScalarWhereInput | Prisma.PrescriptionScalarWhereInput[];
};
export type PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput = {
    create?: Prisma.XOR<Prisma.PrescriptionCreateWithoutPharmacyInput, Prisma.PrescriptionUncheckedCreateWithoutPharmacyInput> | Prisma.PrescriptionCreateWithoutPharmacyInput[] | Prisma.PrescriptionUncheckedCreateWithoutPharmacyInput[];
    connectOrCreate?: Prisma.PrescriptionCreateOrConnectWithoutPharmacyInput | Prisma.PrescriptionCreateOrConnectWithoutPharmacyInput[];
    upsert?: Prisma.PrescriptionUpsertWithWhereUniqueWithoutPharmacyInput | Prisma.PrescriptionUpsertWithWhereUniqueWithoutPharmacyInput[];
    createMany?: Prisma.PrescriptionCreateManyPharmacyInputEnvelope;
    set?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    disconnect?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    delete?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    connect?: Prisma.PrescriptionWhereUniqueInput | Prisma.PrescriptionWhereUniqueInput[];
    update?: Prisma.PrescriptionUpdateWithWhereUniqueWithoutPharmacyInput | Prisma.PrescriptionUpdateWithWhereUniqueWithoutPharmacyInput[];
    updateMany?: Prisma.PrescriptionUpdateManyWithWhereWithoutPharmacyInput | Prisma.PrescriptionUpdateManyWithWhereWithoutPharmacyInput[];
    deleteMany?: Prisma.PrescriptionScalarWhereInput | Prisma.PrescriptionScalarWhereInput[];
};
export type PrescriptionCreateNestedOneWithoutAppointmentInput = {
    create?: Prisma.XOR<Prisma.PrescriptionCreateWithoutAppointmentInput, Prisma.PrescriptionUncheckedCreateWithoutAppointmentInput>;
    connectOrCreate?: Prisma.PrescriptionCreateOrConnectWithoutAppointmentInput;
    connect?: Prisma.PrescriptionWhereUniqueInput;
};
export type PrescriptionUncheckedCreateNestedOneWithoutAppointmentInput = {
    create?: Prisma.XOR<Prisma.PrescriptionCreateWithoutAppointmentInput, Prisma.PrescriptionUncheckedCreateWithoutAppointmentInput>;
    connectOrCreate?: Prisma.PrescriptionCreateOrConnectWithoutAppointmentInput;
    connect?: Prisma.PrescriptionWhereUniqueInput;
};
export type PrescriptionUpdateOneWithoutAppointmentNestedInput = {
    create?: Prisma.XOR<Prisma.PrescriptionCreateWithoutAppointmentInput, Prisma.PrescriptionUncheckedCreateWithoutAppointmentInput>;
    connectOrCreate?: Prisma.PrescriptionCreateOrConnectWithoutAppointmentInput;
    upsert?: Prisma.PrescriptionUpsertWithoutAppointmentInput;
    disconnect?: Prisma.PrescriptionWhereInput | boolean;
    delete?: Prisma.PrescriptionWhereInput | boolean;
    connect?: Prisma.PrescriptionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PrescriptionUpdateToOneWithWhereWithoutAppointmentInput, Prisma.PrescriptionUpdateWithoutAppointmentInput>, Prisma.PrescriptionUncheckedUpdateWithoutAppointmentInput>;
};
export type PrescriptionUncheckedUpdateOneWithoutAppointmentNestedInput = {
    create?: Prisma.XOR<Prisma.PrescriptionCreateWithoutAppointmentInput, Prisma.PrescriptionUncheckedCreateWithoutAppointmentInput>;
    connectOrCreate?: Prisma.PrescriptionCreateOrConnectWithoutAppointmentInput;
    upsert?: Prisma.PrescriptionUpsertWithoutAppointmentInput;
    disconnect?: Prisma.PrescriptionWhereInput | boolean;
    delete?: Prisma.PrescriptionWhereInput | boolean;
    connect?: Prisma.PrescriptionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PrescriptionUpdateToOneWithWhereWithoutAppointmentInput, Prisma.PrescriptionUpdateWithoutAppointmentInput>, Prisma.PrescriptionUncheckedUpdateWithoutAppointmentInput>;
};
export type EnumPrescriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.PrescriptionStatus;
};
export type PrescriptionCreateWithoutDoctorInput = {
    id?: string;
    notes: string;
    status?: $Enums.PrescriptionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    appointment: Prisma.AppointmentCreateNestedOneWithoutPrescriptionInput;
    pharmacy: Prisma.UserCreateNestedOneWithoutPharmacyPrescriptionsInput;
};
export type PrescriptionUncheckedCreateWithoutDoctorInput = {
    id?: string;
    appointmentId: string;
    pharmacyId: string;
    notes: string;
    status?: $Enums.PrescriptionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PrescriptionCreateOrConnectWithoutDoctorInput = {
    where: Prisma.PrescriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.PrescriptionCreateWithoutDoctorInput, Prisma.PrescriptionUncheckedCreateWithoutDoctorInput>;
};
export type PrescriptionCreateManyDoctorInputEnvelope = {
    data: Prisma.PrescriptionCreateManyDoctorInput | Prisma.PrescriptionCreateManyDoctorInput[];
    skipDuplicates?: boolean;
};
export type PrescriptionCreateWithoutPharmacyInput = {
    id?: string;
    notes: string;
    status?: $Enums.PrescriptionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    appointment: Prisma.AppointmentCreateNestedOneWithoutPrescriptionInput;
    doctor: Prisma.UserCreateNestedOneWithoutDoctorPrescriptionsInput;
};
export type PrescriptionUncheckedCreateWithoutPharmacyInput = {
    id?: string;
    appointmentId: string;
    doctorId: string;
    notes: string;
    status?: $Enums.PrescriptionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PrescriptionCreateOrConnectWithoutPharmacyInput = {
    where: Prisma.PrescriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.PrescriptionCreateWithoutPharmacyInput, Prisma.PrescriptionUncheckedCreateWithoutPharmacyInput>;
};
export type PrescriptionCreateManyPharmacyInputEnvelope = {
    data: Prisma.PrescriptionCreateManyPharmacyInput | Prisma.PrescriptionCreateManyPharmacyInput[];
    skipDuplicates?: boolean;
};
export type PrescriptionUpsertWithWhereUniqueWithoutDoctorInput = {
    where: Prisma.PrescriptionWhereUniqueInput;
    update: Prisma.XOR<Prisma.PrescriptionUpdateWithoutDoctorInput, Prisma.PrescriptionUncheckedUpdateWithoutDoctorInput>;
    create: Prisma.XOR<Prisma.PrescriptionCreateWithoutDoctorInput, Prisma.PrescriptionUncheckedCreateWithoutDoctorInput>;
};
export type PrescriptionUpdateWithWhereUniqueWithoutDoctorInput = {
    where: Prisma.PrescriptionWhereUniqueInput;
    data: Prisma.XOR<Prisma.PrescriptionUpdateWithoutDoctorInput, Prisma.PrescriptionUncheckedUpdateWithoutDoctorInput>;
};
export type PrescriptionUpdateManyWithWhereWithoutDoctorInput = {
    where: Prisma.PrescriptionScalarWhereInput;
    data: Prisma.XOR<Prisma.PrescriptionUpdateManyMutationInput, Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorInput>;
};
export type PrescriptionScalarWhereInput = {
    AND?: Prisma.PrescriptionScalarWhereInput | Prisma.PrescriptionScalarWhereInput[];
    OR?: Prisma.PrescriptionScalarWhereInput[];
    NOT?: Prisma.PrescriptionScalarWhereInput | Prisma.PrescriptionScalarWhereInput[];
    id?: Prisma.StringFilter<"Prescription"> | string;
    appointmentId?: Prisma.StringFilter<"Prescription"> | string;
    doctorId?: Prisma.StringFilter<"Prescription"> | string;
    pharmacyId?: Prisma.StringFilter<"Prescription"> | string;
    notes?: Prisma.StringFilter<"Prescription"> | string;
    status?: Prisma.EnumPrescriptionStatusFilter<"Prescription"> | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFilter<"Prescription"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Prescription"> | Date | string;
};
export type PrescriptionUpsertWithWhereUniqueWithoutPharmacyInput = {
    where: Prisma.PrescriptionWhereUniqueInput;
    update: Prisma.XOR<Prisma.PrescriptionUpdateWithoutPharmacyInput, Prisma.PrescriptionUncheckedUpdateWithoutPharmacyInput>;
    create: Prisma.XOR<Prisma.PrescriptionCreateWithoutPharmacyInput, Prisma.PrescriptionUncheckedCreateWithoutPharmacyInput>;
};
export type PrescriptionUpdateWithWhereUniqueWithoutPharmacyInput = {
    where: Prisma.PrescriptionWhereUniqueInput;
    data: Prisma.XOR<Prisma.PrescriptionUpdateWithoutPharmacyInput, Prisma.PrescriptionUncheckedUpdateWithoutPharmacyInput>;
};
export type PrescriptionUpdateManyWithWhereWithoutPharmacyInput = {
    where: Prisma.PrescriptionScalarWhereInput;
    data: Prisma.XOR<Prisma.PrescriptionUpdateManyMutationInput, Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyInput>;
};
export type PrescriptionCreateWithoutAppointmentInput = {
    id?: string;
    notes: string;
    status?: $Enums.PrescriptionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    doctor: Prisma.UserCreateNestedOneWithoutDoctorPrescriptionsInput;
    pharmacy: Prisma.UserCreateNestedOneWithoutPharmacyPrescriptionsInput;
};
export type PrescriptionUncheckedCreateWithoutAppointmentInput = {
    id?: string;
    doctorId: string;
    pharmacyId: string;
    notes: string;
    status?: $Enums.PrescriptionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PrescriptionCreateOrConnectWithoutAppointmentInput = {
    where: Prisma.PrescriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.PrescriptionCreateWithoutAppointmentInput, Prisma.PrescriptionUncheckedCreateWithoutAppointmentInput>;
};
export type PrescriptionUpsertWithoutAppointmentInput = {
    update: Prisma.XOR<Prisma.PrescriptionUpdateWithoutAppointmentInput, Prisma.PrescriptionUncheckedUpdateWithoutAppointmentInput>;
    create: Prisma.XOR<Prisma.PrescriptionCreateWithoutAppointmentInput, Prisma.PrescriptionUncheckedCreateWithoutAppointmentInput>;
    where?: Prisma.PrescriptionWhereInput;
};
export type PrescriptionUpdateToOneWithWhereWithoutAppointmentInput = {
    where?: Prisma.PrescriptionWhereInput;
    data: Prisma.XOR<Prisma.PrescriptionUpdateWithoutAppointmentInput, Prisma.PrescriptionUncheckedUpdateWithoutAppointmentInput>;
};
export type PrescriptionUpdateWithoutAppointmentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doctor?: Prisma.UserUpdateOneRequiredWithoutDoctorPrescriptionsNestedInput;
    pharmacy?: Prisma.UserUpdateOneRequiredWithoutPharmacyPrescriptionsNestedInput;
};
export type PrescriptionUncheckedUpdateWithoutAppointmentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    pharmacyId?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PrescriptionCreateManyDoctorInput = {
    id?: string;
    appointmentId: string;
    pharmacyId: string;
    notes: string;
    status?: $Enums.PrescriptionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PrescriptionCreateManyPharmacyInput = {
    id?: string;
    appointmentId: string;
    doctorId: string;
    notes: string;
    status?: $Enums.PrescriptionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PrescriptionUpdateWithoutDoctorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    appointment?: Prisma.AppointmentUpdateOneRequiredWithoutPrescriptionNestedInput;
    pharmacy?: Prisma.UserUpdateOneRequiredWithoutPharmacyPrescriptionsNestedInput;
};
export type PrescriptionUncheckedUpdateWithoutDoctorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    appointmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    pharmacyId?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PrescriptionUncheckedUpdateManyWithoutDoctorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    appointmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    pharmacyId?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PrescriptionUpdateWithoutPharmacyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    appointment?: Prisma.AppointmentUpdateOneRequiredWithoutPrescriptionNestedInput;
    doctor?: Prisma.UserUpdateOneRequiredWithoutDoctorPrescriptionsNestedInput;
};
export type PrescriptionUncheckedUpdateWithoutPharmacyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    appointmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PrescriptionUncheckedUpdateManyWithoutPharmacyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    appointmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumPrescriptionStatusFieldUpdateOperationsInput | $Enums.PrescriptionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PrescriptionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    appointmentId?: boolean;
    doctorId?: boolean;
    pharmacyId?: boolean;
    notes?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    appointment?: boolean | Prisma.AppointmentDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    pharmacy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["prescription"]>;
export type PrescriptionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    appointmentId?: boolean;
    doctorId?: boolean;
    pharmacyId?: boolean;
    notes?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    appointment?: boolean | Prisma.AppointmentDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    pharmacy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["prescription"]>;
export type PrescriptionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    appointmentId?: boolean;
    doctorId?: boolean;
    pharmacyId?: boolean;
    notes?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    appointment?: boolean | Prisma.AppointmentDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    pharmacy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["prescription"]>;
export type PrescriptionSelectScalar = {
    id?: boolean;
    appointmentId?: boolean;
    doctorId?: boolean;
    pharmacyId?: boolean;
    notes?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PrescriptionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "appointmentId" | "doctorId" | "pharmacyId" | "notes" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["prescription"]>;
export type PrescriptionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    appointment?: boolean | Prisma.AppointmentDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    pharmacy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PrescriptionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    appointment?: boolean | Prisma.AppointmentDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    pharmacy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type PrescriptionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    appointment?: boolean | Prisma.AppointmentDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    pharmacy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $PrescriptionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Prescription";
    objects: {
        appointment: Prisma.$AppointmentPayload<ExtArgs>;
        doctor: Prisma.$UserPayload<ExtArgs>;
        pharmacy: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        appointmentId: string;
        doctorId: string;
        pharmacyId: string;
        notes: string;
        status: $Enums.PrescriptionStatus;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["prescription"]>;
    composites: {};
};
export type PrescriptionGetPayload<S extends boolean | null | undefined | PrescriptionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload, S>;
export type PrescriptionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PrescriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PrescriptionCountAggregateInputType | true;
};
export interface PrescriptionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Prescription'];
        meta: {
            name: 'Prescription';
        };
    };
    findUnique<T extends PrescriptionFindUniqueArgs>(args: Prisma.SelectSubset<T, PrescriptionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PrescriptionClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PrescriptionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PrescriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PrescriptionClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PrescriptionFindFirstArgs>(args?: Prisma.SelectSubset<T, PrescriptionFindFirstArgs<ExtArgs>>): Prisma.Prisma__PrescriptionClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PrescriptionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PrescriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PrescriptionClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PrescriptionFindManyArgs>(args?: Prisma.SelectSubset<T, PrescriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PrescriptionCreateArgs>(args: Prisma.SelectSubset<T, PrescriptionCreateArgs<ExtArgs>>): Prisma.Prisma__PrescriptionClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PrescriptionCreateManyArgs>(args?: Prisma.SelectSubset<T, PrescriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PrescriptionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PrescriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PrescriptionDeleteArgs>(args: Prisma.SelectSubset<T, PrescriptionDeleteArgs<ExtArgs>>): Prisma.Prisma__PrescriptionClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PrescriptionUpdateArgs>(args: Prisma.SelectSubset<T, PrescriptionUpdateArgs<ExtArgs>>): Prisma.Prisma__PrescriptionClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PrescriptionDeleteManyArgs>(args?: Prisma.SelectSubset<T, PrescriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PrescriptionUpdateManyArgs>(args: Prisma.SelectSubset<T, PrescriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PrescriptionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PrescriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PrescriptionUpsertArgs>(args: Prisma.SelectSubset<T, PrescriptionUpsertArgs<ExtArgs>>): Prisma.Prisma__PrescriptionClient<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PrescriptionCountArgs>(args?: Prisma.Subset<T, PrescriptionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PrescriptionCountAggregateOutputType> : number>;
    aggregate<T extends PrescriptionAggregateArgs>(args: Prisma.Subset<T, PrescriptionAggregateArgs>): Prisma.PrismaPromise<GetPrescriptionAggregateType<T>>;
    groupBy<T extends PrescriptionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PrescriptionGroupByArgs['orderBy'];
    } : {
        orderBy?: PrescriptionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PrescriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrescriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PrescriptionFieldRefs;
}
export interface Prisma__PrescriptionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    appointment<T extends Prisma.AppointmentDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AppointmentDefaultArgs<ExtArgs>>): Prisma.Prisma__AppointmentClient<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    doctor<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    pharmacy<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PrescriptionFieldRefs {
    readonly id: Prisma.FieldRef<"Prescription", 'String'>;
    readonly appointmentId: Prisma.FieldRef<"Prescription", 'String'>;
    readonly doctorId: Prisma.FieldRef<"Prescription", 'String'>;
    readonly pharmacyId: Prisma.FieldRef<"Prescription", 'String'>;
    readonly notes: Prisma.FieldRef<"Prescription", 'String'>;
    readonly status: Prisma.FieldRef<"Prescription", 'PrescriptionStatus'>;
    readonly createdAt: Prisma.FieldRef<"Prescription", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Prescription", 'DateTime'>;
}
export type PrescriptionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionInclude<ExtArgs> | null;
    where: Prisma.PrescriptionWhereUniqueInput;
};
export type PrescriptionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionInclude<ExtArgs> | null;
    where: Prisma.PrescriptionWhereUniqueInput;
};
export type PrescriptionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionInclude<ExtArgs> | null;
    where?: Prisma.PrescriptionWhereInput;
    orderBy?: Prisma.PrescriptionOrderByWithRelationInput | Prisma.PrescriptionOrderByWithRelationInput[];
    cursor?: Prisma.PrescriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PrescriptionScalarFieldEnum | Prisma.PrescriptionScalarFieldEnum[];
};
export type PrescriptionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionInclude<ExtArgs> | null;
    where?: Prisma.PrescriptionWhereInput;
    orderBy?: Prisma.PrescriptionOrderByWithRelationInput | Prisma.PrescriptionOrderByWithRelationInput[];
    cursor?: Prisma.PrescriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PrescriptionScalarFieldEnum | Prisma.PrescriptionScalarFieldEnum[];
};
export type PrescriptionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionInclude<ExtArgs> | null;
    where?: Prisma.PrescriptionWhereInput;
    orderBy?: Prisma.PrescriptionOrderByWithRelationInput | Prisma.PrescriptionOrderByWithRelationInput[];
    cursor?: Prisma.PrescriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PrescriptionScalarFieldEnum | Prisma.PrescriptionScalarFieldEnum[];
};
export type PrescriptionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PrescriptionCreateInput, Prisma.PrescriptionUncheckedCreateInput>;
};
export type PrescriptionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PrescriptionCreateManyInput | Prisma.PrescriptionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PrescriptionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PrescriptionOmit<ExtArgs> | null;
    data: Prisma.PrescriptionCreateManyInput | Prisma.PrescriptionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PrescriptionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PrescriptionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PrescriptionUpdateInput, Prisma.PrescriptionUncheckedUpdateInput>;
    where: Prisma.PrescriptionWhereUniqueInput;
};
export type PrescriptionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PrescriptionUpdateManyMutationInput, Prisma.PrescriptionUncheckedUpdateManyInput>;
    where?: Prisma.PrescriptionWhereInput;
    limit?: number;
};
export type PrescriptionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PrescriptionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PrescriptionUpdateManyMutationInput, Prisma.PrescriptionUncheckedUpdateManyInput>;
    where?: Prisma.PrescriptionWhereInput;
    limit?: number;
    include?: Prisma.PrescriptionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PrescriptionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionInclude<ExtArgs> | null;
    where: Prisma.PrescriptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.PrescriptionCreateInput, Prisma.PrescriptionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PrescriptionUpdateInput, Prisma.PrescriptionUncheckedUpdateInput>;
};
export type PrescriptionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionInclude<ExtArgs> | null;
    where: Prisma.PrescriptionWhereUniqueInput;
};
export type PrescriptionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PrescriptionWhereInput;
    limit?: number;
};
export type PrescriptionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PrescriptionSelect<ExtArgs> | null;
    omit?: Prisma.PrescriptionOmit<ExtArgs> | null;
    include?: Prisma.PrescriptionInclude<ExtArgs> | null;
};
export {};
