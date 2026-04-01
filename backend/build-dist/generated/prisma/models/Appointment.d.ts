import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type AppointmentModel = runtime.Types.Result.DefaultSelection<Prisma.$AppointmentPayload>;
export type AggregateAppointment = {
    _count: AppointmentCountAggregateOutputType | null;
    _min: AppointmentMinAggregateOutputType | null;
    _max: AppointmentMaxAggregateOutputType | null;
};
export type AppointmentMinAggregateOutputType = {
    id: string | null;
    patientId: string | null;
    doctorId: string | null;
    status: $Enums.AppointmentStatus | null;
    scheduledAt: Date | null;
    reason: string | null;
    preferredDateFrom: Date | null;
    preferredDateTo: Date | null;
    preferredTimeNote: string | null;
    requiresLab: boolean | null;
    labFlowLocked: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AppointmentMaxAggregateOutputType = {
    id: string | null;
    patientId: string | null;
    doctorId: string | null;
    status: $Enums.AppointmentStatus | null;
    scheduledAt: Date | null;
    reason: string | null;
    preferredDateFrom: Date | null;
    preferredDateTo: Date | null;
    preferredTimeNote: string | null;
    requiresLab: boolean | null;
    labFlowLocked: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AppointmentCountAggregateOutputType = {
    id: number;
    patientId: number;
    doctorId: number;
    status: number;
    scheduledAt: number;
    reason: number;
    preferredDateFrom: number;
    preferredDateTo: number;
    preferredTimeNote: number;
    requiresLab: number;
    labFlowLocked: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type AppointmentMinAggregateInputType = {
    id?: true;
    patientId?: true;
    doctorId?: true;
    status?: true;
    scheduledAt?: true;
    reason?: true;
    preferredDateFrom?: true;
    preferredDateTo?: true;
    preferredTimeNote?: true;
    requiresLab?: true;
    labFlowLocked?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AppointmentMaxAggregateInputType = {
    id?: true;
    patientId?: true;
    doctorId?: true;
    status?: true;
    scheduledAt?: true;
    reason?: true;
    preferredDateFrom?: true;
    preferredDateTo?: true;
    preferredTimeNote?: true;
    requiresLab?: true;
    labFlowLocked?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AppointmentCountAggregateInputType = {
    id?: true;
    patientId?: true;
    doctorId?: true;
    status?: true;
    scheduledAt?: true;
    reason?: true;
    preferredDateFrom?: true;
    preferredDateTo?: true;
    preferredTimeNote?: true;
    requiresLab?: true;
    labFlowLocked?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type AppointmentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AppointmentWhereInput;
    orderBy?: Prisma.AppointmentOrderByWithRelationInput | Prisma.AppointmentOrderByWithRelationInput[];
    cursor?: Prisma.AppointmentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AppointmentCountAggregateInputType;
    _min?: AppointmentMinAggregateInputType;
    _max?: AppointmentMaxAggregateInputType;
};
export type GetAppointmentAggregateType<T extends AppointmentAggregateArgs> = {
    [P in keyof T & keyof AggregateAppointment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAppointment[P]> : Prisma.GetScalarType<T[P], AggregateAppointment[P]>;
};
export type AppointmentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AppointmentWhereInput;
    orderBy?: Prisma.AppointmentOrderByWithAggregationInput | Prisma.AppointmentOrderByWithAggregationInput[];
    by: Prisma.AppointmentScalarFieldEnum[] | Prisma.AppointmentScalarFieldEnum;
    having?: Prisma.AppointmentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AppointmentCountAggregateInputType | true;
    _min?: AppointmentMinAggregateInputType;
    _max?: AppointmentMaxAggregateInputType;
};
export type AppointmentGroupByOutputType = {
    id: string;
    patientId: string;
    doctorId: string;
    status: $Enums.AppointmentStatus;
    scheduledAt: Date | null;
    reason: string | null;
    preferredDateFrom: Date | null;
    preferredDateTo: Date | null;
    preferredTimeNote: string | null;
    requiresLab: boolean;
    labFlowLocked: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: AppointmentCountAggregateOutputType | null;
    _min: AppointmentMinAggregateOutputType | null;
    _max: AppointmentMaxAggregateOutputType | null;
};
export type GetAppointmentGroupByPayload<T extends AppointmentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AppointmentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AppointmentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AppointmentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AppointmentGroupByOutputType[P]>;
}>>;
export type AppointmentWhereInput = {
    AND?: Prisma.AppointmentWhereInput | Prisma.AppointmentWhereInput[];
    OR?: Prisma.AppointmentWhereInput[];
    NOT?: Prisma.AppointmentWhereInput | Prisma.AppointmentWhereInput[];
    id?: Prisma.StringFilter<"Appointment"> | string;
    patientId?: Prisma.StringFilter<"Appointment"> | string;
    doctorId?: Prisma.StringFilter<"Appointment"> | string;
    status?: Prisma.EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.DateTimeNullableFilter<"Appointment"> | Date | string | null;
    reason?: Prisma.StringNullableFilter<"Appointment"> | string | null;
    preferredDateFrom?: Prisma.DateTimeNullableFilter<"Appointment"> | Date | string | null;
    preferredDateTo?: Prisma.DateTimeNullableFilter<"Appointment"> | Date | string | null;
    preferredTimeNote?: Prisma.StringNullableFilter<"Appointment"> | string | null;
    requiresLab?: Prisma.BoolFilter<"Appointment"> | boolean;
    labFlowLocked?: Prisma.BoolFilter<"Appointment"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Appointment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Appointment"> | Date | string;
    patient?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    doctor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    labOrders?: Prisma.LabOrderListRelationFilter;
    prescriptions?: Prisma.PrescriptionListRelationFilter;
};
export type AppointmentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    scheduledAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    preferredDateFrom?: Prisma.SortOrderInput | Prisma.SortOrder;
    preferredDateTo?: Prisma.SortOrderInput | Prisma.SortOrder;
    preferredTimeNote?: Prisma.SortOrderInput | Prisma.SortOrder;
    requiresLab?: Prisma.SortOrder;
    labFlowLocked?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    patient?: Prisma.UserOrderByWithRelationInput;
    doctor?: Prisma.UserOrderByWithRelationInput;
    labOrders?: Prisma.LabOrderOrderByRelationAggregateInput;
    prescriptions?: Prisma.PrescriptionOrderByRelationAggregateInput;
};
export type AppointmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.AppointmentWhereInput | Prisma.AppointmentWhereInput[];
    OR?: Prisma.AppointmentWhereInput[];
    NOT?: Prisma.AppointmentWhereInput | Prisma.AppointmentWhereInput[];
    patientId?: Prisma.StringFilter<"Appointment"> | string;
    doctorId?: Prisma.StringFilter<"Appointment"> | string;
    status?: Prisma.EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.DateTimeNullableFilter<"Appointment"> | Date | string | null;
    reason?: Prisma.StringNullableFilter<"Appointment"> | string | null;
    preferredDateFrom?: Prisma.DateTimeNullableFilter<"Appointment"> | Date | string | null;
    preferredDateTo?: Prisma.DateTimeNullableFilter<"Appointment"> | Date | string | null;
    preferredTimeNote?: Prisma.StringNullableFilter<"Appointment"> | string | null;
    requiresLab?: Prisma.BoolFilter<"Appointment"> | boolean;
    labFlowLocked?: Prisma.BoolFilter<"Appointment"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Appointment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Appointment"> | Date | string;
    patient?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    doctor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    labOrders?: Prisma.LabOrderListRelationFilter;
    prescriptions?: Prisma.PrescriptionListRelationFilter;
}, "id">;
export type AppointmentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    scheduledAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    preferredDateFrom?: Prisma.SortOrderInput | Prisma.SortOrder;
    preferredDateTo?: Prisma.SortOrderInput | Prisma.SortOrder;
    preferredTimeNote?: Prisma.SortOrderInput | Prisma.SortOrder;
    requiresLab?: Prisma.SortOrder;
    labFlowLocked?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.AppointmentCountOrderByAggregateInput;
    _max?: Prisma.AppointmentMaxOrderByAggregateInput;
    _min?: Prisma.AppointmentMinOrderByAggregateInput;
};
export type AppointmentScalarWhereWithAggregatesInput = {
    AND?: Prisma.AppointmentScalarWhereWithAggregatesInput | Prisma.AppointmentScalarWhereWithAggregatesInput[];
    OR?: Prisma.AppointmentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AppointmentScalarWhereWithAggregatesInput | Prisma.AppointmentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Appointment"> | string;
    patientId?: Prisma.StringWithAggregatesFilter<"Appointment"> | string;
    doctorId?: Prisma.StringWithAggregatesFilter<"Appointment"> | string;
    status?: Prisma.EnumAppointmentStatusWithAggregatesFilter<"Appointment"> | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Appointment"> | Date | string | null;
    reason?: Prisma.StringNullableWithAggregatesFilter<"Appointment"> | string | null;
    preferredDateFrom?: Prisma.DateTimeNullableWithAggregatesFilter<"Appointment"> | Date | string | null;
    preferredDateTo?: Prisma.DateTimeNullableWithAggregatesFilter<"Appointment"> | Date | string | null;
    preferredTimeNote?: Prisma.StringNullableWithAggregatesFilter<"Appointment"> | string | null;
    requiresLab?: Prisma.BoolWithAggregatesFilter<"Appointment"> | boolean;
    labFlowLocked?: Prisma.BoolWithAggregatesFilter<"Appointment"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Appointment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Appointment"> | Date | string;
};
export type AppointmentCreateInput = {
    id?: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patient: Prisma.UserCreateNestedOneWithoutPatientAppointmentsInput;
    doctor: Prisma.UserCreateNestedOneWithoutDoctorAppointmentsInput;
    labOrders?: Prisma.LabOrderCreateNestedManyWithoutAppointmentInput;
    prescriptions?: Prisma.PrescriptionCreateNestedManyWithoutAppointmentInput;
};
export type AppointmentUncheckedCreateInput = {
    id?: string;
    patientId: string;
    doctorId: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    labOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutAppointmentInput;
    prescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutAppointmentInput;
};
export type AppointmentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patient?: Prisma.UserUpdateOneRequiredWithoutPatientAppointmentsNestedInput;
    doctor?: Prisma.UserUpdateOneRequiredWithoutDoctorAppointmentsNestedInput;
    labOrders?: Prisma.LabOrderUpdateManyWithoutAppointmentNestedInput;
    prescriptions?: Prisma.PrescriptionUpdateManyWithoutAppointmentNestedInput;
};
export type AppointmentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    labOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutAppointmentNestedInput;
    prescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutAppointmentNestedInput;
};
export type AppointmentCreateManyInput = {
    id?: string;
    patientId: string;
    doctorId: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AppointmentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AppointmentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AppointmentListRelationFilter = {
    every?: Prisma.AppointmentWhereInput;
    some?: Prisma.AppointmentWhereInput;
    none?: Prisma.AppointmentWhereInput;
};
export type AppointmentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AppointmentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    scheduledAt?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    preferredDateFrom?: Prisma.SortOrder;
    preferredDateTo?: Prisma.SortOrder;
    preferredTimeNote?: Prisma.SortOrder;
    requiresLab?: Prisma.SortOrder;
    labFlowLocked?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AppointmentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    scheduledAt?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    preferredDateFrom?: Prisma.SortOrder;
    preferredDateTo?: Prisma.SortOrder;
    preferredTimeNote?: Prisma.SortOrder;
    requiresLab?: Prisma.SortOrder;
    labFlowLocked?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AppointmentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    patientId?: Prisma.SortOrder;
    doctorId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    scheduledAt?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    preferredDateFrom?: Prisma.SortOrder;
    preferredDateTo?: Prisma.SortOrder;
    preferredTimeNote?: Prisma.SortOrder;
    requiresLab?: Prisma.SortOrder;
    labFlowLocked?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AppointmentScalarRelationFilter = {
    is?: Prisma.AppointmentWhereInput;
    isNot?: Prisma.AppointmentWhereInput;
};
export type AppointmentCreateNestedManyWithoutPatientInput = {
    create?: Prisma.XOR<Prisma.AppointmentCreateWithoutPatientInput, Prisma.AppointmentUncheckedCreateWithoutPatientInput> | Prisma.AppointmentCreateWithoutPatientInput[] | Prisma.AppointmentUncheckedCreateWithoutPatientInput[];
    connectOrCreate?: Prisma.AppointmentCreateOrConnectWithoutPatientInput | Prisma.AppointmentCreateOrConnectWithoutPatientInput[];
    createMany?: Prisma.AppointmentCreateManyPatientInputEnvelope;
    connect?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
};
export type AppointmentCreateNestedManyWithoutDoctorInput = {
    create?: Prisma.XOR<Prisma.AppointmentCreateWithoutDoctorInput, Prisma.AppointmentUncheckedCreateWithoutDoctorInput> | Prisma.AppointmentCreateWithoutDoctorInput[] | Prisma.AppointmentUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.AppointmentCreateOrConnectWithoutDoctorInput | Prisma.AppointmentCreateOrConnectWithoutDoctorInput[];
    createMany?: Prisma.AppointmentCreateManyDoctorInputEnvelope;
    connect?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
};
export type AppointmentUncheckedCreateNestedManyWithoutPatientInput = {
    create?: Prisma.XOR<Prisma.AppointmentCreateWithoutPatientInput, Prisma.AppointmentUncheckedCreateWithoutPatientInput> | Prisma.AppointmentCreateWithoutPatientInput[] | Prisma.AppointmentUncheckedCreateWithoutPatientInput[];
    connectOrCreate?: Prisma.AppointmentCreateOrConnectWithoutPatientInput | Prisma.AppointmentCreateOrConnectWithoutPatientInput[];
    createMany?: Prisma.AppointmentCreateManyPatientInputEnvelope;
    connect?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
};
export type AppointmentUncheckedCreateNestedManyWithoutDoctorInput = {
    create?: Prisma.XOR<Prisma.AppointmentCreateWithoutDoctorInput, Prisma.AppointmentUncheckedCreateWithoutDoctorInput> | Prisma.AppointmentCreateWithoutDoctorInput[] | Prisma.AppointmentUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.AppointmentCreateOrConnectWithoutDoctorInput | Prisma.AppointmentCreateOrConnectWithoutDoctorInput[];
    createMany?: Prisma.AppointmentCreateManyDoctorInputEnvelope;
    connect?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
};
export type AppointmentUpdateManyWithoutPatientNestedInput = {
    create?: Prisma.XOR<Prisma.AppointmentCreateWithoutPatientInput, Prisma.AppointmentUncheckedCreateWithoutPatientInput> | Prisma.AppointmentCreateWithoutPatientInput[] | Prisma.AppointmentUncheckedCreateWithoutPatientInput[];
    connectOrCreate?: Prisma.AppointmentCreateOrConnectWithoutPatientInput | Prisma.AppointmentCreateOrConnectWithoutPatientInput[];
    upsert?: Prisma.AppointmentUpsertWithWhereUniqueWithoutPatientInput | Prisma.AppointmentUpsertWithWhereUniqueWithoutPatientInput[];
    createMany?: Prisma.AppointmentCreateManyPatientInputEnvelope;
    set?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    disconnect?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    delete?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    connect?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    update?: Prisma.AppointmentUpdateWithWhereUniqueWithoutPatientInput | Prisma.AppointmentUpdateWithWhereUniqueWithoutPatientInput[];
    updateMany?: Prisma.AppointmentUpdateManyWithWhereWithoutPatientInput | Prisma.AppointmentUpdateManyWithWhereWithoutPatientInput[];
    deleteMany?: Prisma.AppointmentScalarWhereInput | Prisma.AppointmentScalarWhereInput[];
};
export type AppointmentUpdateManyWithoutDoctorNestedInput = {
    create?: Prisma.XOR<Prisma.AppointmentCreateWithoutDoctorInput, Prisma.AppointmentUncheckedCreateWithoutDoctorInput> | Prisma.AppointmentCreateWithoutDoctorInput[] | Prisma.AppointmentUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.AppointmentCreateOrConnectWithoutDoctorInput | Prisma.AppointmentCreateOrConnectWithoutDoctorInput[];
    upsert?: Prisma.AppointmentUpsertWithWhereUniqueWithoutDoctorInput | Prisma.AppointmentUpsertWithWhereUniqueWithoutDoctorInput[];
    createMany?: Prisma.AppointmentCreateManyDoctorInputEnvelope;
    set?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    disconnect?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    delete?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    connect?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    update?: Prisma.AppointmentUpdateWithWhereUniqueWithoutDoctorInput | Prisma.AppointmentUpdateWithWhereUniqueWithoutDoctorInput[];
    updateMany?: Prisma.AppointmentUpdateManyWithWhereWithoutDoctorInput | Prisma.AppointmentUpdateManyWithWhereWithoutDoctorInput[];
    deleteMany?: Prisma.AppointmentScalarWhereInput | Prisma.AppointmentScalarWhereInput[];
};
export type AppointmentUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: Prisma.XOR<Prisma.AppointmentCreateWithoutPatientInput, Prisma.AppointmentUncheckedCreateWithoutPatientInput> | Prisma.AppointmentCreateWithoutPatientInput[] | Prisma.AppointmentUncheckedCreateWithoutPatientInput[];
    connectOrCreate?: Prisma.AppointmentCreateOrConnectWithoutPatientInput | Prisma.AppointmentCreateOrConnectWithoutPatientInput[];
    upsert?: Prisma.AppointmentUpsertWithWhereUniqueWithoutPatientInput | Prisma.AppointmentUpsertWithWhereUniqueWithoutPatientInput[];
    createMany?: Prisma.AppointmentCreateManyPatientInputEnvelope;
    set?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    disconnect?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    delete?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    connect?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    update?: Prisma.AppointmentUpdateWithWhereUniqueWithoutPatientInput | Prisma.AppointmentUpdateWithWhereUniqueWithoutPatientInput[];
    updateMany?: Prisma.AppointmentUpdateManyWithWhereWithoutPatientInput | Prisma.AppointmentUpdateManyWithWhereWithoutPatientInput[];
    deleteMany?: Prisma.AppointmentScalarWhereInput | Prisma.AppointmentScalarWhereInput[];
};
export type AppointmentUncheckedUpdateManyWithoutDoctorNestedInput = {
    create?: Prisma.XOR<Prisma.AppointmentCreateWithoutDoctorInput, Prisma.AppointmentUncheckedCreateWithoutDoctorInput> | Prisma.AppointmentCreateWithoutDoctorInput[] | Prisma.AppointmentUncheckedCreateWithoutDoctorInput[];
    connectOrCreate?: Prisma.AppointmentCreateOrConnectWithoutDoctorInput | Prisma.AppointmentCreateOrConnectWithoutDoctorInput[];
    upsert?: Prisma.AppointmentUpsertWithWhereUniqueWithoutDoctorInput | Prisma.AppointmentUpsertWithWhereUniqueWithoutDoctorInput[];
    createMany?: Prisma.AppointmentCreateManyDoctorInputEnvelope;
    set?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    disconnect?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    delete?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    connect?: Prisma.AppointmentWhereUniqueInput | Prisma.AppointmentWhereUniqueInput[];
    update?: Prisma.AppointmentUpdateWithWhereUniqueWithoutDoctorInput | Prisma.AppointmentUpdateWithWhereUniqueWithoutDoctorInput[];
    updateMany?: Prisma.AppointmentUpdateManyWithWhereWithoutDoctorInput | Prisma.AppointmentUpdateManyWithWhereWithoutDoctorInput[];
    deleteMany?: Prisma.AppointmentScalarWhereInput | Prisma.AppointmentScalarWhereInput[];
};
export type EnumAppointmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.AppointmentStatus;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type AppointmentCreateNestedOneWithoutLabOrdersInput = {
    create?: Prisma.XOR<Prisma.AppointmentCreateWithoutLabOrdersInput, Prisma.AppointmentUncheckedCreateWithoutLabOrdersInput>;
    connectOrCreate?: Prisma.AppointmentCreateOrConnectWithoutLabOrdersInput;
    connect?: Prisma.AppointmentWhereUniqueInput;
};
export type AppointmentUpdateOneRequiredWithoutLabOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.AppointmentCreateWithoutLabOrdersInput, Prisma.AppointmentUncheckedCreateWithoutLabOrdersInput>;
    connectOrCreate?: Prisma.AppointmentCreateOrConnectWithoutLabOrdersInput;
    upsert?: Prisma.AppointmentUpsertWithoutLabOrdersInput;
    connect?: Prisma.AppointmentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AppointmentUpdateToOneWithWhereWithoutLabOrdersInput, Prisma.AppointmentUpdateWithoutLabOrdersInput>, Prisma.AppointmentUncheckedUpdateWithoutLabOrdersInput>;
};
export type AppointmentCreateNestedOneWithoutPrescriptionsInput = {
    create?: Prisma.XOR<Prisma.AppointmentCreateWithoutPrescriptionsInput, Prisma.AppointmentUncheckedCreateWithoutPrescriptionsInput>;
    connectOrCreate?: Prisma.AppointmentCreateOrConnectWithoutPrescriptionsInput;
    connect?: Prisma.AppointmentWhereUniqueInput;
};
export type AppointmentUpdateOneRequiredWithoutPrescriptionsNestedInput = {
    create?: Prisma.XOR<Prisma.AppointmentCreateWithoutPrescriptionsInput, Prisma.AppointmentUncheckedCreateWithoutPrescriptionsInput>;
    connectOrCreate?: Prisma.AppointmentCreateOrConnectWithoutPrescriptionsInput;
    upsert?: Prisma.AppointmentUpsertWithoutPrescriptionsInput;
    connect?: Prisma.AppointmentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AppointmentUpdateToOneWithWhereWithoutPrescriptionsInput, Prisma.AppointmentUpdateWithoutPrescriptionsInput>, Prisma.AppointmentUncheckedUpdateWithoutPrescriptionsInput>;
};
export type AppointmentCreateWithoutPatientInput = {
    id?: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    doctor: Prisma.UserCreateNestedOneWithoutDoctorAppointmentsInput;
    labOrders?: Prisma.LabOrderCreateNestedManyWithoutAppointmentInput;
    prescriptions?: Prisma.PrescriptionCreateNestedManyWithoutAppointmentInput;
};
export type AppointmentUncheckedCreateWithoutPatientInput = {
    id?: string;
    doctorId: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    labOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutAppointmentInput;
    prescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutAppointmentInput;
};
export type AppointmentCreateOrConnectWithoutPatientInput = {
    where: Prisma.AppointmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.AppointmentCreateWithoutPatientInput, Prisma.AppointmentUncheckedCreateWithoutPatientInput>;
};
export type AppointmentCreateManyPatientInputEnvelope = {
    data: Prisma.AppointmentCreateManyPatientInput | Prisma.AppointmentCreateManyPatientInput[];
    skipDuplicates?: boolean;
};
export type AppointmentCreateWithoutDoctorInput = {
    id?: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patient: Prisma.UserCreateNestedOneWithoutPatientAppointmentsInput;
    labOrders?: Prisma.LabOrderCreateNestedManyWithoutAppointmentInput;
    prescriptions?: Prisma.PrescriptionCreateNestedManyWithoutAppointmentInput;
};
export type AppointmentUncheckedCreateWithoutDoctorInput = {
    id?: string;
    patientId: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    labOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutAppointmentInput;
    prescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutAppointmentInput;
};
export type AppointmentCreateOrConnectWithoutDoctorInput = {
    where: Prisma.AppointmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.AppointmentCreateWithoutDoctorInput, Prisma.AppointmentUncheckedCreateWithoutDoctorInput>;
};
export type AppointmentCreateManyDoctorInputEnvelope = {
    data: Prisma.AppointmentCreateManyDoctorInput | Prisma.AppointmentCreateManyDoctorInput[];
    skipDuplicates?: boolean;
};
export type AppointmentUpsertWithWhereUniqueWithoutPatientInput = {
    where: Prisma.AppointmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.AppointmentUpdateWithoutPatientInput, Prisma.AppointmentUncheckedUpdateWithoutPatientInput>;
    create: Prisma.XOR<Prisma.AppointmentCreateWithoutPatientInput, Prisma.AppointmentUncheckedCreateWithoutPatientInput>;
};
export type AppointmentUpdateWithWhereUniqueWithoutPatientInput = {
    where: Prisma.AppointmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.AppointmentUpdateWithoutPatientInput, Prisma.AppointmentUncheckedUpdateWithoutPatientInput>;
};
export type AppointmentUpdateManyWithWhereWithoutPatientInput = {
    where: Prisma.AppointmentScalarWhereInput;
    data: Prisma.XOR<Prisma.AppointmentUpdateManyMutationInput, Prisma.AppointmentUncheckedUpdateManyWithoutPatientInput>;
};
export type AppointmentScalarWhereInput = {
    AND?: Prisma.AppointmentScalarWhereInput | Prisma.AppointmentScalarWhereInput[];
    OR?: Prisma.AppointmentScalarWhereInput[];
    NOT?: Prisma.AppointmentScalarWhereInput | Prisma.AppointmentScalarWhereInput[];
    id?: Prisma.StringFilter<"Appointment"> | string;
    patientId?: Prisma.StringFilter<"Appointment"> | string;
    doctorId?: Prisma.StringFilter<"Appointment"> | string;
    status?: Prisma.EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.DateTimeNullableFilter<"Appointment"> | Date | string | null;
    reason?: Prisma.StringNullableFilter<"Appointment"> | string | null;
    preferredDateFrom?: Prisma.DateTimeNullableFilter<"Appointment"> | Date | string | null;
    preferredDateTo?: Prisma.DateTimeNullableFilter<"Appointment"> | Date | string | null;
    preferredTimeNote?: Prisma.StringNullableFilter<"Appointment"> | string | null;
    requiresLab?: Prisma.BoolFilter<"Appointment"> | boolean;
    labFlowLocked?: Prisma.BoolFilter<"Appointment"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Appointment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Appointment"> | Date | string;
};
export type AppointmentUpsertWithWhereUniqueWithoutDoctorInput = {
    where: Prisma.AppointmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.AppointmentUpdateWithoutDoctorInput, Prisma.AppointmentUncheckedUpdateWithoutDoctorInput>;
    create: Prisma.XOR<Prisma.AppointmentCreateWithoutDoctorInput, Prisma.AppointmentUncheckedCreateWithoutDoctorInput>;
};
export type AppointmentUpdateWithWhereUniqueWithoutDoctorInput = {
    where: Prisma.AppointmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.AppointmentUpdateWithoutDoctorInput, Prisma.AppointmentUncheckedUpdateWithoutDoctorInput>;
};
export type AppointmentUpdateManyWithWhereWithoutDoctorInput = {
    where: Prisma.AppointmentScalarWhereInput;
    data: Prisma.XOR<Prisma.AppointmentUpdateManyMutationInput, Prisma.AppointmentUncheckedUpdateManyWithoutDoctorInput>;
};
export type AppointmentCreateWithoutLabOrdersInput = {
    id?: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patient: Prisma.UserCreateNestedOneWithoutPatientAppointmentsInput;
    doctor: Prisma.UserCreateNestedOneWithoutDoctorAppointmentsInput;
    prescriptions?: Prisma.PrescriptionCreateNestedManyWithoutAppointmentInput;
};
export type AppointmentUncheckedCreateWithoutLabOrdersInput = {
    id?: string;
    patientId: string;
    doctorId: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    prescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutAppointmentInput;
};
export type AppointmentCreateOrConnectWithoutLabOrdersInput = {
    where: Prisma.AppointmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.AppointmentCreateWithoutLabOrdersInput, Prisma.AppointmentUncheckedCreateWithoutLabOrdersInput>;
};
export type AppointmentUpsertWithoutLabOrdersInput = {
    update: Prisma.XOR<Prisma.AppointmentUpdateWithoutLabOrdersInput, Prisma.AppointmentUncheckedUpdateWithoutLabOrdersInput>;
    create: Prisma.XOR<Prisma.AppointmentCreateWithoutLabOrdersInput, Prisma.AppointmentUncheckedCreateWithoutLabOrdersInput>;
    where?: Prisma.AppointmentWhereInput;
};
export type AppointmentUpdateToOneWithWhereWithoutLabOrdersInput = {
    where?: Prisma.AppointmentWhereInput;
    data: Prisma.XOR<Prisma.AppointmentUpdateWithoutLabOrdersInput, Prisma.AppointmentUncheckedUpdateWithoutLabOrdersInput>;
};
export type AppointmentUpdateWithoutLabOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patient?: Prisma.UserUpdateOneRequiredWithoutPatientAppointmentsNestedInput;
    doctor?: Prisma.UserUpdateOneRequiredWithoutDoctorAppointmentsNestedInput;
    prescriptions?: Prisma.PrescriptionUpdateManyWithoutAppointmentNestedInput;
};
export type AppointmentUncheckedUpdateWithoutLabOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    prescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutAppointmentNestedInput;
};
export type AppointmentCreateWithoutPrescriptionsInput = {
    id?: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patient: Prisma.UserCreateNestedOneWithoutPatientAppointmentsInput;
    doctor: Prisma.UserCreateNestedOneWithoutDoctorAppointmentsInput;
    labOrders?: Prisma.LabOrderCreateNestedManyWithoutAppointmentInput;
};
export type AppointmentUncheckedCreateWithoutPrescriptionsInput = {
    id?: string;
    patientId: string;
    doctorId: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    labOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutAppointmentInput;
};
export type AppointmentCreateOrConnectWithoutPrescriptionsInput = {
    where: Prisma.AppointmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.AppointmentCreateWithoutPrescriptionsInput, Prisma.AppointmentUncheckedCreateWithoutPrescriptionsInput>;
};
export type AppointmentUpsertWithoutPrescriptionsInput = {
    update: Prisma.XOR<Prisma.AppointmentUpdateWithoutPrescriptionsInput, Prisma.AppointmentUncheckedUpdateWithoutPrescriptionsInput>;
    create: Prisma.XOR<Prisma.AppointmentCreateWithoutPrescriptionsInput, Prisma.AppointmentUncheckedCreateWithoutPrescriptionsInput>;
    where?: Prisma.AppointmentWhereInput;
};
export type AppointmentUpdateToOneWithWhereWithoutPrescriptionsInput = {
    where?: Prisma.AppointmentWhereInput;
    data: Prisma.XOR<Prisma.AppointmentUpdateWithoutPrescriptionsInput, Prisma.AppointmentUncheckedUpdateWithoutPrescriptionsInput>;
};
export type AppointmentUpdateWithoutPrescriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patient?: Prisma.UserUpdateOneRequiredWithoutPatientAppointmentsNestedInput;
    doctor?: Prisma.UserUpdateOneRequiredWithoutDoctorAppointmentsNestedInput;
    labOrders?: Prisma.LabOrderUpdateManyWithoutAppointmentNestedInput;
};
export type AppointmentUncheckedUpdateWithoutPrescriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    labOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutAppointmentNestedInput;
};
export type AppointmentCreateManyPatientInput = {
    id?: string;
    doctorId: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AppointmentCreateManyDoctorInput = {
    id?: string;
    patientId: string;
    status?: $Enums.AppointmentStatus;
    scheduledAt?: Date | string | null;
    reason?: string | null;
    preferredDateFrom?: Date | string | null;
    preferredDateTo?: Date | string | null;
    preferredTimeNote?: string | null;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AppointmentUpdateWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doctor?: Prisma.UserUpdateOneRequiredWithoutDoctorAppointmentsNestedInput;
    labOrders?: Prisma.LabOrderUpdateManyWithoutAppointmentNestedInput;
    prescriptions?: Prisma.PrescriptionUpdateManyWithoutAppointmentNestedInput;
};
export type AppointmentUncheckedUpdateWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    labOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutAppointmentNestedInput;
    prescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutAppointmentNestedInput;
};
export type AppointmentUncheckedUpdateManyWithoutPatientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    doctorId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AppointmentUpdateWithoutDoctorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patient?: Prisma.UserUpdateOneRequiredWithoutPatientAppointmentsNestedInput;
    labOrders?: Prisma.LabOrderUpdateManyWithoutAppointmentNestedInput;
    prescriptions?: Prisma.PrescriptionUpdateManyWithoutAppointmentNestedInput;
};
export type AppointmentUncheckedUpdateWithoutDoctorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    labOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutAppointmentNestedInput;
    prescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutAppointmentNestedInput;
};
export type AppointmentUncheckedUpdateManyWithoutDoctorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    patientId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus;
    scheduledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    preferredDateFrom?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredDateTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    preferredTimeNote?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requiresLab?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    labFlowLocked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AppointmentCountOutputType = {
    labOrders: number;
    prescriptions: number;
};
export type AppointmentCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    labOrders?: boolean | AppointmentCountOutputTypeCountLabOrdersArgs;
    prescriptions?: boolean | AppointmentCountOutputTypeCountPrescriptionsArgs;
};
export type AppointmentCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentCountOutputTypeSelect<ExtArgs> | null;
};
export type AppointmentCountOutputTypeCountLabOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LabOrderWhereInput;
};
export type AppointmentCountOutputTypeCountPrescriptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PrescriptionWhereInput;
};
export type AppointmentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    patientId?: boolean;
    doctorId?: boolean;
    status?: boolean;
    scheduledAt?: boolean;
    reason?: boolean;
    preferredDateFrom?: boolean;
    preferredDateTo?: boolean;
    preferredTimeNote?: boolean;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    patient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    labOrders?: boolean | Prisma.Appointment$labOrdersArgs<ExtArgs>;
    prescriptions?: boolean | Prisma.Appointment$prescriptionsArgs<ExtArgs>;
    _count?: boolean | Prisma.AppointmentCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["appointment"]>;
export type AppointmentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    patientId?: boolean;
    doctorId?: boolean;
    status?: boolean;
    scheduledAt?: boolean;
    reason?: boolean;
    preferredDateFrom?: boolean;
    preferredDateTo?: boolean;
    preferredTimeNote?: boolean;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    patient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["appointment"]>;
export type AppointmentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    patientId?: boolean;
    doctorId?: boolean;
    status?: boolean;
    scheduledAt?: boolean;
    reason?: boolean;
    preferredDateFrom?: boolean;
    preferredDateTo?: boolean;
    preferredTimeNote?: boolean;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    patient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["appointment"]>;
export type AppointmentSelectScalar = {
    id?: boolean;
    patientId?: boolean;
    doctorId?: boolean;
    status?: boolean;
    scheduledAt?: boolean;
    reason?: boolean;
    preferredDateFrom?: boolean;
    preferredDateTo?: boolean;
    preferredTimeNote?: boolean;
    requiresLab?: boolean;
    labFlowLocked?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type AppointmentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "patientId" | "doctorId" | "status" | "scheduledAt" | "reason" | "preferredDateFrom" | "preferredDateTo" | "preferredTimeNote" | "requiresLab" | "labFlowLocked" | "createdAt" | "updatedAt", ExtArgs["result"]["appointment"]>;
export type AppointmentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    labOrders?: boolean | Prisma.Appointment$labOrdersArgs<ExtArgs>;
    prescriptions?: boolean | Prisma.Appointment$prescriptionsArgs<ExtArgs>;
    _count?: boolean | Prisma.AppointmentCountOutputTypeDefaultArgs<ExtArgs>;
};
export type AppointmentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type AppointmentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    doctor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $AppointmentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Appointment";
    objects: {
        patient: Prisma.$UserPayload<ExtArgs>;
        doctor: Prisma.$UserPayload<ExtArgs>;
        labOrders: Prisma.$LabOrderPayload<ExtArgs>[];
        prescriptions: Prisma.$PrescriptionPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        patientId: string;
        doctorId: string;
        status: $Enums.AppointmentStatus;
        scheduledAt: Date | null;
        reason: string | null;
        preferredDateFrom: Date | null;
        preferredDateTo: Date | null;
        preferredTimeNote: string | null;
        requiresLab: boolean;
        labFlowLocked: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["appointment"]>;
    composites: {};
};
export type AppointmentGetPayload<S extends boolean | null | undefined | AppointmentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AppointmentPayload, S>;
export type AppointmentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AppointmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AppointmentCountAggregateInputType | true;
};
export interface AppointmentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Appointment'];
        meta: {
            name: 'Appointment';
        };
    };
    findUnique<T extends AppointmentFindUniqueArgs>(args: Prisma.SelectSubset<T, AppointmentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AppointmentClient<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AppointmentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AppointmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AppointmentClient<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AppointmentFindFirstArgs>(args?: Prisma.SelectSubset<T, AppointmentFindFirstArgs<ExtArgs>>): Prisma.Prisma__AppointmentClient<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AppointmentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AppointmentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AppointmentClient<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AppointmentFindManyArgs>(args?: Prisma.SelectSubset<T, AppointmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AppointmentCreateArgs>(args: Prisma.SelectSubset<T, AppointmentCreateArgs<ExtArgs>>): Prisma.Prisma__AppointmentClient<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AppointmentCreateManyArgs>(args?: Prisma.SelectSubset<T, AppointmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AppointmentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AppointmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AppointmentDeleteArgs>(args: Prisma.SelectSubset<T, AppointmentDeleteArgs<ExtArgs>>): Prisma.Prisma__AppointmentClient<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AppointmentUpdateArgs>(args: Prisma.SelectSubset<T, AppointmentUpdateArgs<ExtArgs>>): Prisma.Prisma__AppointmentClient<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AppointmentDeleteManyArgs>(args?: Prisma.SelectSubset<T, AppointmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AppointmentUpdateManyArgs>(args: Prisma.SelectSubset<T, AppointmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AppointmentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AppointmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AppointmentUpsertArgs>(args: Prisma.SelectSubset<T, AppointmentUpsertArgs<ExtArgs>>): Prisma.Prisma__AppointmentClient<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AppointmentCountArgs>(args?: Prisma.Subset<T, AppointmentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AppointmentCountAggregateOutputType> : number>;
    aggregate<T extends AppointmentAggregateArgs>(args: Prisma.Subset<T, AppointmentAggregateArgs>): Prisma.PrismaPromise<GetAppointmentAggregateType<T>>;
    groupBy<T extends AppointmentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AppointmentGroupByArgs['orderBy'];
    } : {
        orderBy?: AppointmentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AppointmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppointmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AppointmentFieldRefs;
}
export interface Prisma__AppointmentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    patient<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    doctor<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    labOrders<T extends Prisma.Appointment$labOrdersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Appointment$labOrdersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    prescriptions<T extends Prisma.Appointment$prescriptionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Appointment$prescriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AppointmentFieldRefs {
    readonly id: Prisma.FieldRef<"Appointment", 'String'>;
    readonly patientId: Prisma.FieldRef<"Appointment", 'String'>;
    readonly doctorId: Prisma.FieldRef<"Appointment", 'String'>;
    readonly status: Prisma.FieldRef<"Appointment", 'AppointmentStatus'>;
    readonly scheduledAt: Prisma.FieldRef<"Appointment", 'DateTime'>;
    readonly reason: Prisma.FieldRef<"Appointment", 'String'>;
    readonly preferredDateFrom: Prisma.FieldRef<"Appointment", 'DateTime'>;
    readonly preferredDateTo: Prisma.FieldRef<"Appointment", 'DateTime'>;
    readonly preferredTimeNote: Prisma.FieldRef<"Appointment", 'String'>;
    readonly requiresLab: Prisma.FieldRef<"Appointment", 'Boolean'>;
    readonly labFlowLocked: Prisma.FieldRef<"Appointment", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Appointment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Appointment", 'DateTime'>;
}
export type AppointmentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentSelect<ExtArgs> | null;
    omit?: Prisma.AppointmentOmit<ExtArgs> | null;
    include?: Prisma.AppointmentInclude<ExtArgs> | null;
    where: Prisma.AppointmentWhereUniqueInput;
};
export type AppointmentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentSelect<ExtArgs> | null;
    omit?: Prisma.AppointmentOmit<ExtArgs> | null;
    include?: Prisma.AppointmentInclude<ExtArgs> | null;
    where: Prisma.AppointmentWhereUniqueInput;
};
export type AppointmentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentSelect<ExtArgs> | null;
    omit?: Prisma.AppointmentOmit<ExtArgs> | null;
    include?: Prisma.AppointmentInclude<ExtArgs> | null;
    where?: Prisma.AppointmentWhereInput;
    orderBy?: Prisma.AppointmentOrderByWithRelationInput | Prisma.AppointmentOrderByWithRelationInput[];
    cursor?: Prisma.AppointmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AppointmentScalarFieldEnum | Prisma.AppointmentScalarFieldEnum[];
};
export type AppointmentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentSelect<ExtArgs> | null;
    omit?: Prisma.AppointmentOmit<ExtArgs> | null;
    include?: Prisma.AppointmentInclude<ExtArgs> | null;
    where?: Prisma.AppointmentWhereInput;
    orderBy?: Prisma.AppointmentOrderByWithRelationInput | Prisma.AppointmentOrderByWithRelationInput[];
    cursor?: Prisma.AppointmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AppointmentScalarFieldEnum | Prisma.AppointmentScalarFieldEnum[];
};
export type AppointmentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentSelect<ExtArgs> | null;
    omit?: Prisma.AppointmentOmit<ExtArgs> | null;
    include?: Prisma.AppointmentInclude<ExtArgs> | null;
    where?: Prisma.AppointmentWhereInput;
    orderBy?: Prisma.AppointmentOrderByWithRelationInput | Prisma.AppointmentOrderByWithRelationInput[];
    cursor?: Prisma.AppointmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AppointmentScalarFieldEnum | Prisma.AppointmentScalarFieldEnum[];
};
export type AppointmentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentSelect<ExtArgs> | null;
    omit?: Prisma.AppointmentOmit<ExtArgs> | null;
    include?: Prisma.AppointmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AppointmentCreateInput, Prisma.AppointmentUncheckedCreateInput>;
};
export type AppointmentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AppointmentCreateManyInput | Prisma.AppointmentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AppointmentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AppointmentOmit<ExtArgs> | null;
    data: Prisma.AppointmentCreateManyInput | Prisma.AppointmentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.AppointmentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type AppointmentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentSelect<ExtArgs> | null;
    omit?: Prisma.AppointmentOmit<ExtArgs> | null;
    include?: Prisma.AppointmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AppointmentUpdateInput, Prisma.AppointmentUncheckedUpdateInput>;
    where: Prisma.AppointmentWhereUniqueInput;
};
export type AppointmentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AppointmentUpdateManyMutationInput, Prisma.AppointmentUncheckedUpdateManyInput>;
    where?: Prisma.AppointmentWhereInput;
    limit?: number;
};
export type AppointmentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AppointmentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AppointmentUpdateManyMutationInput, Prisma.AppointmentUncheckedUpdateManyInput>;
    where?: Prisma.AppointmentWhereInput;
    limit?: number;
    include?: Prisma.AppointmentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type AppointmentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentSelect<ExtArgs> | null;
    omit?: Prisma.AppointmentOmit<ExtArgs> | null;
    include?: Prisma.AppointmentInclude<ExtArgs> | null;
    where: Prisma.AppointmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.AppointmentCreateInput, Prisma.AppointmentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AppointmentUpdateInput, Prisma.AppointmentUncheckedUpdateInput>;
};
export type AppointmentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentSelect<ExtArgs> | null;
    omit?: Prisma.AppointmentOmit<ExtArgs> | null;
    include?: Prisma.AppointmentInclude<ExtArgs> | null;
    where: Prisma.AppointmentWhereUniqueInput;
};
export type AppointmentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AppointmentWhereInput;
    limit?: number;
};
export type Appointment$labOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabOrderSelect<ExtArgs> | null;
    omit?: Prisma.LabOrderOmit<ExtArgs> | null;
    include?: Prisma.LabOrderInclude<ExtArgs> | null;
    where?: Prisma.LabOrderWhereInput;
    orderBy?: Prisma.LabOrderOrderByWithRelationInput | Prisma.LabOrderOrderByWithRelationInput[];
    cursor?: Prisma.LabOrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LabOrderScalarFieldEnum | Prisma.LabOrderScalarFieldEnum[];
};
export type Appointment$prescriptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type AppointmentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AppointmentSelect<ExtArgs> | null;
    omit?: Prisma.AppointmentOmit<ExtArgs> | null;
    include?: Prisma.AppointmentInclude<ExtArgs> | null;
};
