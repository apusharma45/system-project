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
    fullName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    passwordHash: string | null;
    role: $Enums.Role | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    passwordHash: string | null;
    role: $Enums.Role | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    fullName: number;
    email: number;
    phone: number;
    address: number;
    passwordHash: number;
    role: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    fullName?: true;
    email?: true;
    phone?: true;
    address?: true;
    passwordHash?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    fullName?: true;
    email?: true;
    phone?: true;
    address?: true;
    passwordHash?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    fullName?: true;
    email?: true;
    phone?: true;
    address?: true;
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
    fullName: string | null;
    email: string;
    phone: string | null;
    address: string | null;
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
    fullName?: Prisma.StringNullableFilter<"User"> | string | null;
    email?: Prisma.StringFilter<"User"> | string;
    phone?: Prisma.StringNullableFilter<"User"> | string | null;
    address?: Prisma.StringNullableFilter<"User"> | string | null;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    patientAppointments?: Prisma.AppointmentListRelationFilter;
    doctorAppointments?: Prisma.AppointmentListRelationFilter;
    diagnosticLabOrders?: Prisma.LabOrderListRelationFilter;
    doctorPrescriptions?: Prisma.PrescriptionListRelationFilter;
    pharmacyPrescriptions?: Prisma.PrescriptionListRelationFilter;
    notifications?: Prisma.NotificationListRelationFilter;
    auditLogs?: Prisma.AuditLogListRelationFilter;
    patientProfile?: Prisma.XOR<Prisma.PatientProfileNullableScalarRelationFilter, Prisma.PatientProfileWhereInput> | null;
    professionalProfile?: Prisma.XOR<Prisma.ProfessionalProfileNullableScalarRelationFilter, Prisma.ProfessionalProfileWhereInput> | null;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    patientAppointments?: Prisma.AppointmentOrderByRelationAggregateInput;
    doctorAppointments?: Prisma.AppointmentOrderByRelationAggregateInput;
    diagnosticLabOrders?: Prisma.LabOrderOrderByRelationAggregateInput;
    doctorPrescriptions?: Prisma.PrescriptionOrderByRelationAggregateInput;
    pharmacyPrescriptions?: Prisma.PrescriptionOrderByRelationAggregateInput;
    notifications?: Prisma.NotificationOrderByRelationAggregateInput;
    auditLogs?: Prisma.AuditLogOrderByRelationAggregateInput;
    patientProfile?: Prisma.PatientProfileOrderByWithRelationInput;
    professionalProfile?: Prisma.ProfessionalProfileOrderByWithRelationInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    fullName?: Prisma.StringNullableFilter<"User"> | string | null;
    phone?: Prisma.StringNullableFilter<"User"> | string | null;
    address?: Prisma.StringNullableFilter<"User"> | string | null;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    patientAppointments?: Prisma.AppointmentListRelationFilter;
    doctorAppointments?: Prisma.AppointmentListRelationFilter;
    diagnosticLabOrders?: Prisma.LabOrderListRelationFilter;
    doctorPrescriptions?: Prisma.PrescriptionListRelationFilter;
    pharmacyPrescriptions?: Prisma.PrescriptionListRelationFilter;
    notifications?: Prisma.NotificationListRelationFilter;
    auditLogs?: Prisma.AuditLogListRelationFilter;
    patientProfile?: Prisma.XOR<Prisma.PatientProfileNullableScalarRelationFilter, Prisma.PatientProfileWhereInput> | null;
    professionalProfile?: Prisma.XOR<Prisma.ProfessionalProfileNullableScalarRelationFilter, Prisma.ProfessionalProfileWhereInput> | null;
}, "id" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
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
    fullName?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    phone?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    address?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    passwordHash?: Prisma.StringWithAggregatesFilter<"User"> | string;
    role?: Prisma.EnumRoleWithAggregatesFilter<"User"> | $Enums.Role;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileCreateNestedOneWithoutUserInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileUncheckedCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedCreateNestedOneWithoutUserInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUpdateOneWithoutUserNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUncheckedUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedUpdateOneWithoutUserNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type UserCreateNestedOneWithoutPatientProfileInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPatientProfileInput, Prisma.UserUncheckedCreateWithoutPatientProfileInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPatientProfileInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutPatientProfileNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPatientProfileInput, Prisma.UserUncheckedCreateWithoutPatientProfileInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPatientProfileInput;
    upsert?: Prisma.UserUpsertWithoutPatientProfileInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutPatientProfileInput, Prisma.UserUpdateWithoutPatientProfileInput>, Prisma.UserUncheckedUpdateWithoutPatientProfileInput>;
};
export type UserCreateNestedOneWithoutProfessionalProfileInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutProfessionalProfileInput, Prisma.UserUncheckedCreateWithoutProfessionalProfileInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutProfessionalProfileInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutProfessionalProfileNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutProfessionalProfileInput, Prisma.UserUncheckedCreateWithoutProfessionalProfileInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutProfessionalProfileInput;
    upsert?: Prisma.UserUpsertWithoutProfessionalProfileInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutProfessionalProfileInput, Prisma.UserUpdateWithoutProfessionalProfileInput>, Prisma.UserUncheckedUpdateWithoutProfessionalProfileInput>;
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
export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutNotificationsInput, Prisma.UserUncheckedCreateWithoutNotificationsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutNotificationsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutNotificationsInput, Prisma.UserUncheckedCreateWithoutNotificationsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutNotificationsInput;
    upsert?: Prisma.UserUpsertWithoutNotificationsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutNotificationsInput, Prisma.UserUpdateWithoutNotificationsInput>, Prisma.UserUncheckedUpdateWithoutNotificationsInput>;
};
export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAuditLogsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAuditLogsInput;
    upsert?: Prisma.UserUpsertWithoutAuditLogsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAuditLogsInput, Prisma.UserUpdateWithoutAuditLogsInput>, Prisma.UserUncheckedUpdateWithoutAuditLogsInput>;
};
export type UserCreateWithoutPatientProfileInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    professionalProfile?: Prisma.ProfessionalProfileCreateNestedOneWithoutUserInput;
};
export type UserUncheckedCreateWithoutPatientProfileInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedCreateNestedOneWithoutUserInput;
};
export type UserCreateOrConnectWithoutPatientProfileInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutPatientProfileInput, Prisma.UserUncheckedCreateWithoutPatientProfileInput>;
};
export type UserUpsertWithoutPatientProfileInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutPatientProfileInput, Prisma.UserUncheckedUpdateWithoutPatientProfileInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutPatientProfileInput, Prisma.UserUncheckedCreateWithoutPatientProfileInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutPatientProfileInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutPatientProfileInput, Prisma.UserUncheckedUpdateWithoutPatientProfileInput>;
};
export type UserUpdateWithoutPatientProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUpdateOneWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutPatientProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedUpdateOneWithoutUserNestedInput;
};
export type UserCreateWithoutProfessionalProfileInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileCreateNestedOneWithoutPatientInput;
};
export type UserUncheckedCreateWithoutProfessionalProfileInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileUncheckedCreateNestedOneWithoutPatientInput;
};
export type UserCreateOrConnectWithoutProfessionalProfileInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutProfessionalProfileInput, Prisma.UserUncheckedCreateWithoutProfessionalProfileInput>;
};
export type UserUpsertWithoutProfessionalProfileInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutProfessionalProfileInput, Prisma.UserUncheckedUpdateWithoutProfessionalProfileInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutProfessionalProfileInput, Prisma.UserUncheckedCreateWithoutProfessionalProfileInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutProfessionalProfileInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutProfessionalProfileInput, Prisma.UserUncheckedUpdateWithoutProfessionalProfileInput>;
};
export type UserUpdateWithoutProfessionalProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUpdateOneWithoutPatientNestedInput;
};
export type UserUncheckedUpdateWithoutProfessionalProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUncheckedUpdateOneWithoutPatientNestedInput;
};
export type UserCreateWithoutPatientAppointmentsInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileCreateNestedOneWithoutUserInput;
};
export type UserUncheckedCreateWithoutPatientAppointmentsInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileUncheckedCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedCreateNestedOneWithoutUserInput;
};
export type UserCreateOrConnectWithoutPatientAppointmentsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutPatientAppointmentsInput, Prisma.UserUncheckedCreateWithoutPatientAppointmentsInput>;
};
export type UserCreateWithoutDoctorAppointmentsInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileCreateNestedOneWithoutUserInput;
};
export type UserUncheckedCreateWithoutDoctorAppointmentsInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileUncheckedCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedCreateNestedOneWithoutUserInput;
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
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUpdateOneWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutPatientAppointmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUncheckedUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedUpdateOneWithoutUserNestedInput;
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
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUpdateOneWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutDoctorAppointmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUncheckedUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedUpdateOneWithoutUserNestedInput;
};
export type UserCreateWithoutDiagnosticLabOrdersInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileCreateNestedOneWithoutUserInput;
};
export type UserUncheckedCreateWithoutDiagnosticLabOrdersInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileUncheckedCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedCreateNestedOneWithoutUserInput;
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
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUpdateOneWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutDiagnosticLabOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUncheckedUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedUpdateOneWithoutUserNestedInput;
};
export type UserCreateWithoutDoctorPrescriptionsInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileCreateNestedOneWithoutUserInput;
};
export type UserUncheckedCreateWithoutDoctorPrescriptionsInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileUncheckedCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedCreateNestedOneWithoutUserInput;
};
export type UserCreateOrConnectWithoutDoctorPrescriptionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutDoctorPrescriptionsInput, Prisma.UserUncheckedCreateWithoutDoctorPrescriptionsInput>;
};
export type UserCreateWithoutPharmacyPrescriptionsInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileCreateNestedOneWithoutUserInput;
};
export type UserUncheckedCreateWithoutPharmacyPrescriptionsInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileUncheckedCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedCreateNestedOneWithoutUserInput;
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
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUpdateOneWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutDoctorPrescriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUncheckedUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedUpdateOneWithoutUserNestedInput;
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
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUpdateOneWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutPharmacyPrescriptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUncheckedUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedUpdateOneWithoutUserNestedInput;
};
export type UserCreateWithoutNotificationsInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileCreateNestedOneWithoutUserInput;
};
export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    patientProfile?: Prisma.PatientProfileUncheckedCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedCreateNestedOneWithoutUserInput;
};
export type UserCreateOrConnectWithoutNotificationsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutNotificationsInput, Prisma.UserUncheckedCreateWithoutNotificationsInput>;
};
export type UserUpsertWithoutNotificationsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutNotificationsInput, Prisma.UserUncheckedUpdateWithoutNotificationsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutNotificationsInput, Prisma.UserUncheckedCreateWithoutNotificationsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutNotificationsInput, Prisma.UserUncheckedUpdateWithoutNotificationsInput>;
};
export type UserUpdateWithoutNotificationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUpdateOneWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    patientProfile?: Prisma.PatientProfileUncheckedUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedUpdateOneWithoutUserNestedInput;
};
export type UserCreateWithoutAuditLogsInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    patientProfile?: Prisma.PatientProfileCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileCreateNestedOneWithoutUserInput;
};
export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string;
    fullName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
    passwordHash: string;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutPatientInput;
    doctorAppointments?: Prisma.AppointmentUncheckedCreateNestedManyWithoutDoctorInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutDoctorInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedCreateNestedManyWithoutPharmacyInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    patientProfile?: Prisma.PatientProfileUncheckedCreateNestedOneWithoutPatientInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedCreateNestedOneWithoutUserInput;
};
export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
};
export type UserUpsertWithoutAuditLogsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutAuditLogsInput, Prisma.UserUncheckedUpdateWithoutAuditLogsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutAuditLogsInput, Prisma.UserUncheckedUpdateWithoutAuditLogsInput>;
};
export type UserUpdateWithoutAuditLogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    patientProfile?: Prisma.PatientProfileUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUpdateOneWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    patientAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutPatientNestedInput;
    doctorAppointments?: Prisma.AppointmentUncheckedUpdateManyWithoutDoctorNestedInput;
    diagnosticLabOrders?: Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput;
    doctorPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutDoctorNestedInput;
    pharmacyPrescriptions?: Prisma.PrescriptionUncheckedUpdateManyWithoutPharmacyNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    patientProfile?: Prisma.PatientProfileUncheckedUpdateOneWithoutPatientNestedInput;
    professionalProfile?: Prisma.ProfessionalProfileUncheckedUpdateOneWithoutUserNestedInput;
};
export type UserCountOutputType = {
    patientAppointments: number;
    doctorAppointments: number;
    diagnosticLabOrders: number;
    doctorPrescriptions: number;
    pharmacyPrescriptions: number;
    notifications: number;
    auditLogs: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patientAppointments?: boolean | UserCountOutputTypeCountPatientAppointmentsArgs;
    doctorAppointments?: boolean | UserCountOutputTypeCountDoctorAppointmentsArgs;
    diagnosticLabOrders?: boolean | UserCountOutputTypeCountDiagnosticLabOrdersArgs;
    doctorPrescriptions?: boolean | UserCountOutputTypeCountDoctorPrescriptionsArgs;
    pharmacyPrescriptions?: boolean | UserCountOutputTypeCountPharmacyPrescriptionsArgs;
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs;
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs;
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
export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NotificationWhereInput;
};
export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuditLogWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fullName?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    patientAppointments?: boolean | Prisma.User$patientAppointmentsArgs<ExtArgs>;
    doctorAppointments?: boolean | Prisma.User$doctorAppointmentsArgs<ExtArgs>;
    diagnosticLabOrders?: boolean | Prisma.User$diagnosticLabOrdersArgs<ExtArgs>;
    doctorPrescriptions?: boolean | Prisma.User$doctorPrescriptionsArgs<ExtArgs>;
    pharmacyPrescriptions?: boolean | Prisma.User$pharmacyPrescriptionsArgs<ExtArgs>;
    notifications?: boolean | Prisma.User$notificationsArgs<ExtArgs>;
    auditLogs?: boolean | Prisma.User$auditLogsArgs<ExtArgs>;
    patientProfile?: boolean | Prisma.User$patientProfileArgs<ExtArgs>;
    professionalProfile?: boolean | Prisma.User$professionalProfileArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fullName?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fullName?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    fullName?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    passwordHash?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "fullName" | "email" | "phone" | "address" | "passwordHash" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    patientAppointments?: boolean | Prisma.User$patientAppointmentsArgs<ExtArgs>;
    doctorAppointments?: boolean | Prisma.User$doctorAppointmentsArgs<ExtArgs>;
    diagnosticLabOrders?: boolean | Prisma.User$diagnosticLabOrdersArgs<ExtArgs>;
    doctorPrescriptions?: boolean | Prisma.User$doctorPrescriptionsArgs<ExtArgs>;
    pharmacyPrescriptions?: boolean | Prisma.User$pharmacyPrescriptionsArgs<ExtArgs>;
    notifications?: boolean | Prisma.User$notificationsArgs<ExtArgs>;
    auditLogs?: boolean | Prisma.User$auditLogsArgs<ExtArgs>;
    patientProfile?: boolean | Prisma.User$patientProfileArgs<ExtArgs>;
    professionalProfile?: boolean | Prisma.User$professionalProfileArgs<ExtArgs>;
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
        notifications: Prisma.$NotificationPayload<ExtArgs>[];
        auditLogs: Prisma.$AuditLogPayload<ExtArgs>[];
        patientProfile: Prisma.$PatientProfilePayload<ExtArgs> | null;
        professionalProfile: Prisma.$ProfessionalProfilePayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        fullName: string | null;
        email: string;
        phone: string | null;
        address: string | null;
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
    notifications<T extends Prisma.User$notificationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    auditLogs<T extends Prisma.User$auditLogsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    patientProfile<T extends Prisma.User$patientProfileArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$patientProfileArgs<ExtArgs>>): Prisma.Prisma__PatientProfileClient<runtime.Types.Result.GetResult<Prisma.$PatientProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    professionalProfile<T extends Prisma.User$professionalProfileArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$professionalProfileArgs<ExtArgs>>): Prisma.Prisma__ProfessionalProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfessionalProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly fullName: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly phone: Prisma.FieldRef<"User", 'String'>;
    readonly address: Prisma.FieldRef<"User", 'String'>;
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
export type User$notificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput | Prisma.NotificationOrderByWithRelationInput[];
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NotificationScalarFieldEnum | Prisma.NotificationScalarFieldEnum[];
};
export type User$auditLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    where?: Prisma.AuditLogWhereInput;
    orderBy?: Prisma.AuditLogOrderByWithRelationInput | Prisma.AuditLogOrderByWithRelationInput[];
    cursor?: Prisma.AuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuditLogScalarFieldEnum | Prisma.AuditLogScalarFieldEnum[];
};
export type User$patientProfileArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PatientProfileSelect<ExtArgs> | null;
    omit?: Prisma.PatientProfileOmit<ExtArgs> | null;
    include?: Prisma.PatientProfileInclude<ExtArgs> | null;
    where?: Prisma.PatientProfileWhereInput;
};
export type User$professionalProfileArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProfessionalProfileSelect<ExtArgs> | null;
    omit?: Prisma.ProfessionalProfileOmit<ExtArgs> | null;
    include?: Prisma.ProfessionalProfileInclude<ExtArgs> | null;
    where?: Prisma.ProfessionalProfileWhereInput;
};
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
export {};
