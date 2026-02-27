import * as $Enums from "./enums";
import type * as Prisma from "./internal/prismaNamespace";
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleFilter<$PrismaModel> | $Enums.Role;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type EnumAppointmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | Prisma.EnumAppointmentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.AppointmentStatus[] | Prisma.ListEnumAppointmentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AppointmentStatus[] | Prisma.ListEnumAppointmentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAppointmentStatusFilter<$PrismaModel> | $Enums.AppointmentStatus;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type EnumAppointmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | Prisma.EnumAppointmentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.AppointmentStatus[] | Prisma.ListEnumAppointmentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AppointmentStatus[] | Prisma.ListEnumAppointmentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppointmentStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAppointmentStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAppointmentStatusFilter<$PrismaModel>;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type EnumLabOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LabOrderStatus | Prisma.EnumLabOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LabOrderStatus[] | Prisma.ListEnumLabOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LabOrderStatus[] | Prisma.ListEnumLabOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLabOrderStatusFilter<$PrismaModel> | $Enums.LabOrderStatus;
};
export type EnumLabOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LabOrderStatus | Prisma.EnumLabOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LabOrderStatus[] | Prisma.ListEnumLabOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LabOrderStatus[] | Prisma.ListEnumLabOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLabOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.LabOrderStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLabOrderStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLabOrderStatusFilter<$PrismaModel>;
};
export type EnumPrescriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PrescriptionStatus | Prisma.EnumPrescriptionStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PrescriptionStatus[] | Prisma.ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PrescriptionStatus[] | Prisma.ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPrescriptionStatusFilter<$PrismaModel> | $Enums.PrescriptionStatus;
};
export type EnumPrescriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PrescriptionStatus | Prisma.EnumPrescriptionStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PrescriptionStatus[] | Prisma.ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PrescriptionStatus[] | Prisma.ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPrescriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.PrescriptionStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPrescriptionStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPrescriptionStatusFilter<$PrismaModel>;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleFilter<$PrismaModel> | $Enums.Role;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedEnumAppointmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | Prisma.EnumAppointmentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.AppointmentStatus[] | Prisma.ListEnumAppointmentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AppointmentStatus[] | Prisma.ListEnumAppointmentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAppointmentStatusFilter<$PrismaModel> | $Enums.AppointmentStatus;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | Prisma.EnumAppointmentStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.AppointmentStatus[] | Prisma.ListEnumAppointmentStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AppointmentStatus[] | Prisma.ListEnumAppointmentStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppointmentStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAppointmentStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAppointmentStatusFilter<$PrismaModel>;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedEnumLabOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LabOrderStatus | Prisma.EnumLabOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LabOrderStatus[] | Prisma.ListEnumLabOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LabOrderStatus[] | Prisma.ListEnumLabOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLabOrderStatusFilter<$PrismaModel> | $Enums.LabOrderStatus;
};
export type NestedEnumLabOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LabOrderStatus | Prisma.EnumLabOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LabOrderStatus[] | Prisma.ListEnumLabOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LabOrderStatus[] | Prisma.ListEnumLabOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLabOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.LabOrderStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLabOrderStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLabOrderStatusFilter<$PrismaModel>;
};
export type NestedEnumPrescriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PrescriptionStatus | Prisma.EnumPrescriptionStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PrescriptionStatus[] | Prisma.ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PrescriptionStatus[] | Prisma.ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPrescriptionStatusFilter<$PrismaModel> | $Enums.PrescriptionStatus;
};
export type NestedEnumPrescriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PrescriptionStatus | Prisma.EnumPrescriptionStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.PrescriptionStatus[] | Prisma.ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PrescriptionStatus[] | Prisma.ListEnumPrescriptionStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPrescriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.PrescriptionStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPrescriptionStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPrescriptionStatusFilter<$PrismaModel>;
};
