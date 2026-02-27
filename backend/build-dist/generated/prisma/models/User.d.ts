import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    passwordHash: string | null;
    role: $Enums.Role | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    passwordHash: string | null;
    role: $Enums.Role | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    passwordHash: number;
    role: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    patientAppointments?: Prisma.AppointmentListRelationFilter;
    doctorAppointments?: Prisma.AppointmentListRelationFilter;
    diagnosticLabOrders?: Prisma.LabOrderListRelationFilter;
    doctorPrescriptions?: Prisma.PrescriptionListRelationFilter;
    pharmacyPrescriptions?: Prisma.PrescriptionListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    patientAppointments?: Prisma.AppointmentOrderByRelationAggregateInput;
    doctorAppointments?: Prisma.AppointmentOrderByRelationAggregateInput;
    diagnosticLabOrders?: Prisma.LabOrderOrderByRelationAggregateInput;
    doctorPrescriptions?: Prisma.PrescriptionOrderByRelationAggregateInput;
    pharmacyPrescriptions?: Prisma.PrescriptionOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    passwordHash?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    patientAppointments?: Prisma.AppointmentListRelationFilter;
    doctorAppointments?: Prisma.AppointmentListRelationFilter;
    diagnosticLabOrders?: Prisma.LabOrderListRelationFilter;
    doctorPrescriptions?: Prisma.PrescriptionListRelationFilter;
    pharmacyPrescriptions?: Prisma.PrescriptionListRelationFilter;
}, "id" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    passwordHash?: Prisma.StringWithAggregatesFilter<"User"> | string;
    role?: Prisma.EnumRoleWithAggregatesFilter<"User"> | $Enums.Role;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type UserCreateNestedOneWithoutPatientAppointmentsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPatientAppointmentsInput, Prisma.UserUncheckedCreateWithoutPatientAppointmentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPatientAppointmentsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserCreateNestedOneWithoutDoctorAppointmentsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDoctorAppointmentsInput, Prisma.UserUncheckedCreateWithoutDoctorAppointmentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDoctorAppointmentsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutPatientAppointmentsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPatientAppointmentsInput, Prisma.UserUncheckedCreateWithoutPatientAppointmentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPatientAppointmentsInput;
    upsert?: Prisma.UserUpsertWithoutPatientAppointmentsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutPatientAppointmentsInput, Prisma.UserUpdateWithoutPatientAppointmentsInput>, Prisma.UserUncheckedUpdateWithoutPatientAppointmentsInput>;
};
export type UserUpdateOneRequiredWithoutDoctorAppointmentsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDoctorAppointmentsInput, Prisma.UserUncheckedCreateWithoutDoctorAppointmentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDoctorAppointmentsInput;
    upsert?: Prisma.UserUpsertWithoutDoctorAppointmentsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutDoctorAppointmentsInput, Prisma.UserUpdateWithoutDoctorAppointmentsInput>, Prisma.UserUncheckedUpdateWithoutDoctorAppointmentsInput>;
};
export type UserCreateNestedOneWithoutDiagnosticLabOrdersInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDiagnosticLabOrdersInput, Prisma.UserUncheckedCreateWithoutDiagnosticLabOrdersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDiagnosticLabOrdersInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutDiagnosticLabOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDiagnosticLabOrdersInput, Prisma.UserUncheckedCreateWithoutDiagnosticLabOrdersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDiagnosticLabOrdersInput;
    upsert?: Prisma.UserUpsertWithoutDiagnosticLabOrdersInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutDiagnosticLabOrdersInput, Prisma.UserUpdateWithoutDiagnosticLabOrdersInput>, Prisma.UserUncheckedUpdateWithoutDiagnosticLabOrdersInput>;
};
export type UserCreateNestedOneWithoutDoctorPrescriptionsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDoctorPrescriptionsInput, Prisma.UserUncheckedCreateWithoutDoctorPrescriptionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDoctorPrescriptionsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserCreateNestedOneWithoutPharmacyPrescriptionsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPharmacyPrescriptionsInput, Prisma.UserUncheckedCreateWithoutPharmacyPrescriptionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPharmacyPrescriptionsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutDoctorPrescriptionsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDoctorPrescriptionsInput, Prisma.UserUncheckedCreateWithoutDoctorPrescriptionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDoctorPrescriptionsInput;
    upsert?: Prisma.UserUpsertWithoutDoctorPrescriptionsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutDoctorPrescriptionsInput, Prisma.UserUpdateWithoutDoctorPrescriptionsInput>, Prisma.UserUncheckedUpdateWithoutDoctorPrescriptionsInput>;
};
export type UserUpdateOneRequiredWithoutPharmacyPrescriptionsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPharmacyPrescriptionsInput, Prisma.UserUncheckedCreateWithoutPharmacyPrescriptionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPharmacyPrescriptionsInput;
    upsert?: Prisma.UserUpsertWithoutPharmacyPrescriptionsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutPharmacyPrescriptionsInput, Prisma.UserUpdateWithoutPharmacyPrescriptionsInput>, Prisma.UserUncheckedUpdateWithoutPharmacyPrescriptionsInput>;
};
export type UserCreateWithoutPatientAppointmentsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
};
export type UserUncheckedCreateWithoutPatientAppointmentsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
};
export type UserCreateOrConnectWithoutPatientAppointmentsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutPatientAppointmentsInput, Prisma.UserUncheckedCreateWithoutPatientAppointmentsInput>;
};
export type UserCreateWithoutDoctorAppointmentsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
};
export type UserUncheckedCreateWithoutDoctorAppointmentsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
};
export type UserCreateOrConnectWithoutDoctorAppointmentsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutDoctorAppointmentsInput, Prisma.UserUncheckedCreateWithoutDoctorAppointmentsInput>;
};
export type UserUpsertWithoutPatientAppointmentsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutPatientAppointmentsInput, Prisma.UserUncheckedUpdateWithoutPatientAppointmentsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutPatientAppointmentsInput, Prisma.UserUncheckedCreateWithoutPatientAppointmentsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutPatientAppointmentsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutPatientAppointmentsInput, Prisma.UserUncheckedUpdateWithoutPatientAppointmentsInput>;
};
export type UserUpdateWithoutPatientAppointmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
};
export type UserUncheckedUpdateWithoutPatientAppointmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
};
export type UserUpsertWithoutDoctorAppointmentsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutDoctorAppointmentsInput, Prisma.UserUncheckedUpdateWithoutDoctorAppointmentsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutDoctorAppointmentsInput, Prisma.UserUncheckedCreateWithoutDoctorAppointmentsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutDoctorAppointmentsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutDoctorAppointmentsInput, Prisma.UserUncheckedUpdateWithoutDoctorAppointmentsInput>;
};
export type UserUpdateWithoutDoctorAppointmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
};
export type UserUncheckedUpdateWithoutDoctorAppointmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
};
export type UserCreateWithoutDiagnosticLabOrdersInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
};
export type UserUncheckedCreateWithoutDiagnosticLabOrdersInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
};
export type UserCreateOrConnectWithoutDiagnosticLabOrdersInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutDiagnosticLabOrdersInput, Prisma.UserUncheckedCreateWithoutDiagnosticLabOrdersInput>;
};
export type UserUpsertWithoutDiagnosticLabOrdersInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutDiagnosticLabOrdersInput, Prisma.UserUncheckedUpdateWithoutDiagnosticLabOrdersInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutDiagnosticLabOrdersInput, Prisma.UserUncheckedCreateWithoutDiagnosticLabOrdersInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutDiagnosticLabOrdersInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutDiagnosticLabOrdersInput, Prisma.UserUncheckedUpdateWithoutDiagnosticLabOrdersInput>;
};
export type UserUpdateWithoutDiagnosticLabOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
};
export type UserUncheckedUpdateWithoutDiagnosticLabOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
};
export type UserCreateWithoutDoctorPrescriptionsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
};
export type UserUncheckedCreateWithoutDoctorPrescriptionsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
};
export type UserCreateOrConnectWithoutDoctorPrescriptionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutDoctorPrescriptionsInput, Prisma.UserUncheckedCreateWithoutDoctorPrescriptionsInput>;
};
export type UserCreateWithoutPharmacyPrescriptionsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
};
export type UserUncheckedCreateWithoutPharmacyPrescriptionsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
};
export type UserCreateOrConnectWithoutPharmacyPrescriptionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutPharmacyPrescriptionsInput, Prisma.UserUncheckedCreateWithoutPharmacyPrescriptionsInput>;
};
export type UserUpsertWithoutDoctorPrescriptionsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutDoctorPrescriptionsInput, Prisma.UserUncheckedUpdateWithoutDoctorPrescriptionsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutDoctorPrescriptionsInput, Prisma.UserUncheckedCreateWithoutDoctorPrescriptionsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutDoctorPrescriptionsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutDoctorPrescriptionsInput, Prisma.UserUncheckedUpdateWithoutDoctorPrescriptionsInput>;
};
export type UserUpdateWithoutDoctorPrescriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
};
export type UserUncheckedUpdateWithoutDoctorPrescriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
};
export type UserUpsertWithoutPharmacyPrescriptionsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutPharmacyPrescriptionsInput, Prisma.UserUncheckedUpdateWithoutPharmacyPrescriptionsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutPharmacyPrescriptionsInput, Prisma.UserUncheckedCreateWithoutPharmacyPrescriptionsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutPharmacyPrescriptionsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutPharmacyPrescriptionsInput, Prisma.UserUncheckedUpdateWithoutPharmacyPrescriptionsInput>;
};
export type UserUpdateWithoutPharmacyPrescriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
};
export type UserUncheckedUpdateWithoutPharmacyPrescriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
};
export type UserCountOutputType = {
    patientAppointments: number;
    doctorAppointments: number;
    diagnosticLabOrders: number;
    doctorPrescriptions: number;
    pharmacyPrescriptions: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patientAppointments?: boolean | UserCountOutputTypeCountPatientAppointmentsArgs;
    doctorAppointments?: boolean | UserCountOutputTypeCountDoctorAppointmentsArgs;
    diagnosticLabOrders?: boolean | UserCountOutputTypeCountDiagnosticLabOrdersArgs;
    doctorPrescriptions?: boolean | UserCountOutputTypeCountDoctorPrescriptionsArgs;
    pharmacyPrescriptions?: boolean | UserCountOutputTypeCountPharmacyPrescriptionsArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountPatientAppointmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AppointmentWhereInput;
};
export type UserCountOutputTypeCountDoctorAppointmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AppointmentWhereInput;
};
export type UserCountOutputTypeCountDiagnosticLabOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LabOrderWhereInput;
};
export type UserCountOutputTypeCountDoctorPrescriptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PrescriptionWhereInput;
};
export type UserCountOutputTypeCountPharmacyPrescriptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PrescriptionWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    patientAppointments?: boolean | Prisma.User$patientAppointmentsArgs<ExtArgs>;
    doctorAppointments?: boolean | Prisma.User$doctorAppointmentsArgs<ExtArgs>;
    diagnosticLabOrders?: boolean | Prisma.User$diagnosticLabOrdersArgs<ExtArgs>;
    doctorPrescriptions?: boolean | Prisma.User$doctorPrescriptionsArgs<ExtArgs>;
    pharmacyPrescriptions?: boolean | Prisma.User$pharmacyPrescriptionsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "passwordHash" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patientAppointments?: boolean | Prisma.User$patientAppointmentsArgs<ExtArgs>;
    doctorAppointments?: boolean | Prisma.User$doctorAppointmentsArgs<ExtArgs>;
    diagnosticLabOrders?: boolean | Prisma.User$diagnosticLabOrdersArgs<ExtArgs>;
    doctorPrescriptions?: boolean | Prisma.User$doctorPrescriptionsArgs<ExtArgs>;
    pharmacyPrescriptions?: boolean | Prisma.User$pharmacyPrescriptionsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        patientAppointments: Prisma.$AppointmentPayload<ExtArgs>[];
        doctorAppointments: Prisma.$AppointmentPayload<ExtArgs>[];
        diagnosticLabOrders: Prisma.$LabOrderPayload<ExtArgs>[];
        doctorPrescriptions: Prisma.$PrescriptionPayload<ExtArgs>[];
        pharmacyPrescriptions: Prisma.$PrescriptionPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string;
        passwordHash: string;
        role: $Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    patientAppointments<T extends Prisma.User$patientAppointmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$patientAppointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    doctorAppointments<T extends Prisma.User$doctorAppointmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$doctorAppointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    diagnosticLabOrders<T extends Prisma.User$diagnosticLabOrdersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$diagnosticLabOrdersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    doctorPrescriptions<T extends Prisma.User$doctorPrescriptionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$doctorPrescriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    pharmacyPrescriptions<T extends Prisma.User$pharmacyPrescriptionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$pharmacyPrescriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PrescriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly passwordHash: Prisma.FieldRef<"User", 'String'>;
    readonly role: Prisma.FieldRef<"User", 'Role'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$patientAppointmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$doctorAppointmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$diagnosticLabOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$doctorPrescriptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$pharmacyPrescriptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
export {};
