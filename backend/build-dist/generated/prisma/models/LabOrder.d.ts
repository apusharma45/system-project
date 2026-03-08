import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type LabOrderModel = runtime.Types.Result.DefaultSelection<Prisma.$LabOrderPayload>;
export type AggregateLabOrder = {
    _count: LabOrderCountAggregateOutputType | null;
    _min: LabOrderMinAggregateOutputType | null;
    _max: LabOrderMaxAggregateOutputType | null;
};
export type LabOrderMinAggregateOutputType = {
    id: string | null;
    appointmentId: string | null;
    diagnosticId: string | null;
    status: $Enums.LabOrderStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LabOrderMaxAggregateOutputType = {
    id: string | null;
    appointmentId: string | null;
    diagnosticId: string | null;
    status: $Enums.LabOrderStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LabOrderCountAggregateOutputType = {
    id: number;
    appointmentId: number;
    diagnosticId: number;
    status: number;
    tests: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type LabOrderMinAggregateInputType = {
    id?: true;
    appointmentId?: true;
    diagnosticId?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LabOrderMaxAggregateInputType = {
    id?: true;
    appointmentId?: true;
    diagnosticId?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LabOrderCountAggregateInputType = {
    id?: true;
    appointmentId?: true;
    diagnosticId?: true;
    status?: true;
    tests?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type LabOrderAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LabOrderWhereInput;
    orderBy?: Prisma.LabOrderOrderByWithRelationInput | Prisma.LabOrderOrderByWithRelationInput[];
    cursor?: Prisma.LabOrderWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LabOrderCountAggregateInputType;
    _min?: LabOrderMinAggregateInputType;
    _max?: LabOrderMaxAggregateInputType;
};
export type GetLabOrderAggregateType<T extends LabOrderAggregateArgs> = {
    [P in keyof T & keyof AggregateLabOrder]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLabOrder[P]> : Prisma.GetScalarType<T[P], AggregateLabOrder[P]>;
};
export type LabOrderGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LabOrderWhereInput;
    orderBy?: Prisma.LabOrderOrderByWithAggregationInput | Prisma.LabOrderOrderByWithAggregationInput[];
    by: Prisma.LabOrderScalarFieldEnum[] | Prisma.LabOrderScalarFieldEnum;
    having?: Prisma.LabOrderScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LabOrderCountAggregateInputType | true;
    _min?: LabOrderMinAggregateInputType;
    _max?: LabOrderMaxAggregateInputType;
};
export type LabOrderGroupByOutputType = {
    id: string;
    appointmentId: string;
    diagnosticId: string;
    status: $Enums.LabOrderStatus;
    tests: runtime.JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
    _count: LabOrderCountAggregateOutputType | null;
    _min: LabOrderMinAggregateOutputType | null;
    _max: LabOrderMaxAggregateOutputType | null;
};
type GetLabOrderGroupByPayload<T extends LabOrderGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LabOrderGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LabOrderGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LabOrderGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LabOrderGroupByOutputType[P]>;
}>>;
export type LabOrderWhereInput = {
    AND?: Prisma.LabOrderWhereInput | Prisma.LabOrderWhereInput[];
    OR?: Prisma.LabOrderWhereInput[];
    NOT?: Prisma.LabOrderWhereInput | Prisma.LabOrderWhereInput[];
    id?: Prisma.StringFilter<"LabOrder"> | string;
    appointmentId?: Prisma.StringFilter<"LabOrder"> | string;
    diagnosticId?: Prisma.StringFilter<"LabOrder"> | string;
    status?: Prisma.EnumLabOrderStatusFilter<"LabOrder"> | $Enums.LabOrderStatus;
    tests?: Prisma.JsonNullableFilter<"LabOrder">;
    createdAt?: Prisma.DateTimeFilter<"LabOrder"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LabOrder"> | Date | string;
    appointment?: Prisma.XOR<Prisma.AppointmentScalarRelationFilter, Prisma.AppointmentWhereInput>;
    diagnostic?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    labResult?: Prisma.XOR<Prisma.LabResultNullableScalarRelationFilter, Prisma.LabResultWhereInput> | null;
};
export type LabOrderOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    appointmentId?: Prisma.SortOrder;
    diagnosticId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    tests?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    appointment?: Prisma.AppointmentOrderByWithRelationInput;
    diagnostic?: Prisma.UserOrderByWithRelationInput;
    labResult?: Prisma.LabResultOrderByWithRelationInput;
};
export type LabOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.LabOrderWhereInput | Prisma.LabOrderWhereInput[];
    OR?: Prisma.LabOrderWhereInput[];
    NOT?: Prisma.LabOrderWhereInput | Prisma.LabOrderWhereInput[];
    appointmentId?: Prisma.StringFilter<"LabOrder"> | string;
    diagnosticId?: Prisma.StringFilter<"LabOrder"> | string;
    status?: Prisma.EnumLabOrderStatusFilter<"LabOrder"> | $Enums.LabOrderStatus;
    tests?: Prisma.JsonNullableFilter<"LabOrder">;
    createdAt?: Prisma.DateTimeFilter<"LabOrder"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LabOrder"> | Date | string;
    appointment?: Prisma.XOR<Prisma.AppointmentScalarRelationFilter, Prisma.AppointmentWhereInput>;
    diagnostic?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    labResult?: Prisma.XOR<Prisma.LabResultNullableScalarRelationFilter, Prisma.LabResultWhereInput> | null;
}, "id">;
export type LabOrderOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    appointmentId?: Prisma.SortOrder;
    diagnosticId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    tests?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.LabOrderCountOrderByAggregateInput;
    _max?: Prisma.LabOrderMaxOrderByAggregateInput;
    _min?: Prisma.LabOrderMinOrderByAggregateInput;
};
export type LabOrderScalarWhereWithAggregatesInput = {
    AND?: Prisma.LabOrderScalarWhereWithAggregatesInput | Prisma.LabOrderScalarWhereWithAggregatesInput[];
    OR?: Prisma.LabOrderScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LabOrderScalarWhereWithAggregatesInput | Prisma.LabOrderScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"LabOrder"> | string;
    appointmentId?: Prisma.StringWithAggregatesFilter<"LabOrder"> | string;
    diagnosticId?: Prisma.StringWithAggregatesFilter<"LabOrder"> | string;
    status?: Prisma.EnumLabOrderStatusWithAggregatesFilter<"LabOrder"> | $Enums.LabOrderStatus;
    tests?: Prisma.JsonNullableWithAggregatesFilter<"LabOrder">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LabOrder"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"LabOrder"> | Date | string;
};
export type LabOrderCreateInput = {
    id?: string;
    status?: $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    appointment: Prisma.AppointmentCreateNestedOneWithoutLabOrdersInput;
    diagnostic: Prisma.UserCreateNestedOneWithoutDiagnosticLabOrdersInput;
    labResult?: Prisma.LabResultCreateNestedOneWithoutLabOrderInput;
};
export type LabOrderUncheckedCreateInput = {
    id?: string;
    appointmentId: string;
    diagnosticId: string;
    status?: $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    labResult?: Prisma.LabResultUncheckedCreateNestedOneWithoutLabOrderInput;
};
export type LabOrderUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumLabOrderStatusFieldUpdateOperationsInput | $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    appointment?: Prisma.AppointmentUpdateOneRequiredWithoutLabOrdersNestedInput;
    diagnostic?: Prisma.UserUpdateOneRequiredWithoutDiagnosticLabOrdersNestedInput;
    labResult?: Prisma.LabResultUpdateOneWithoutLabOrderNestedInput;
};
export type LabOrderUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    appointmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    diagnosticId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumLabOrderStatusFieldUpdateOperationsInput | $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    labResult?: Prisma.LabResultUncheckedUpdateOneWithoutLabOrderNestedInput;
};
export type LabOrderCreateManyInput = {
    id?: string;
    appointmentId: string;
    diagnosticId: string;
    status?: $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LabOrderUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumLabOrderStatusFieldUpdateOperationsInput | $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LabOrderUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    appointmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    diagnosticId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumLabOrderStatusFieldUpdateOperationsInput | $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LabOrderListRelationFilter = {
    every?: Prisma.LabOrderWhereInput;
    some?: Prisma.LabOrderWhereInput;
    none?: Prisma.LabOrderWhereInput;
};
export type LabOrderOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LabOrderCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    appointmentId?: Prisma.SortOrder;
    diagnosticId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    tests?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LabOrderMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    appointmentId?: Prisma.SortOrder;
    diagnosticId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LabOrderMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    appointmentId?: Prisma.SortOrder;
    diagnosticId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LabOrderScalarRelationFilter = {
    is?: Prisma.LabOrderWhereInput;
    isNot?: Prisma.LabOrderWhereInput;
};
export type LabOrderCreateNestedManyWithoutDiagnosticInput = {
    create?: Prisma.XOR<Prisma.LabOrderCreateWithoutDiagnosticInput, Prisma.LabOrderUncheckedCreateWithoutDiagnosticInput> | Prisma.LabOrderCreateWithoutDiagnosticInput[] | Prisma.LabOrderUncheckedCreateWithoutDiagnosticInput[];
    connectOrCreate?: Prisma.LabOrderCreateOrConnectWithoutDiagnosticInput | Prisma.LabOrderCreateOrConnectWithoutDiagnosticInput[];
    createMany?: Prisma.LabOrderCreateManyDiagnosticInputEnvelope;
    connect?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
};
export type LabOrderUncheckedCreateNestedManyWithoutDiagnosticInput = {
    create?: Prisma.XOR<Prisma.LabOrderCreateWithoutDiagnosticInput, Prisma.LabOrderUncheckedCreateWithoutDiagnosticInput> | Prisma.LabOrderCreateWithoutDiagnosticInput[] | Prisma.LabOrderUncheckedCreateWithoutDiagnosticInput[];
    connectOrCreate?: Prisma.LabOrderCreateOrConnectWithoutDiagnosticInput | Prisma.LabOrderCreateOrConnectWithoutDiagnosticInput[];
    createMany?: Prisma.LabOrderCreateManyDiagnosticInputEnvelope;
    connect?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
};
export type LabOrderUpdateManyWithoutDiagnosticNestedInput = {
    create?: Prisma.XOR<Prisma.LabOrderCreateWithoutDiagnosticInput, Prisma.LabOrderUncheckedCreateWithoutDiagnosticInput> | Prisma.LabOrderCreateWithoutDiagnosticInput[] | Prisma.LabOrderUncheckedCreateWithoutDiagnosticInput[];
    connectOrCreate?: Prisma.LabOrderCreateOrConnectWithoutDiagnosticInput | Prisma.LabOrderCreateOrConnectWithoutDiagnosticInput[];
    upsert?: Prisma.LabOrderUpsertWithWhereUniqueWithoutDiagnosticInput | Prisma.LabOrderUpsertWithWhereUniqueWithoutDiagnosticInput[];
    createMany?: Prisma.LabOrderCreateManyDiagnosticInputEnvelope;
    set?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    disconnect?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    delete?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    connect?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    update?: Prisma.LabOrderUpdateWithWhereUniqueWithoutDiagnosticInput | Prisma.LabOrderUpdateWithWhereUniqueWithoutDiagnosticInput[];
    updateMany?: Prisma.LabOrderUpdateManyWithWhereWithoutDiagnosticInput | Prisma.LabOrderUpdateManyWithWhereWithoutDiagnosticInput[];
    deleteMany?: Prisma.LabOrderScalarWhereInput | Prisma.LabOrderScalarWhereInput[];
};
export type LabOrderUncheckedUpdateManyWithoutDiagnosticNestedInput = {
    create?: Prisma.XOR<Prisma.LabOrderCreateWithoutDiagnosticInput, Prisma.LabOrderUncheckedCreateWithoutDiagnosticInput> | Prisma.LabOrderCreateWithoutDiagnosticInput[] | Prisma.LabOrderUncheckedCreateWithoutDiagnosticInput[];
    connectOrCreate?: Prisma.LabOrderCreateOrConnectWithoutDiagnosticInput | Prisma.LabOrderCreateOrConnectWithoutDiagnosticInput[];
    upsert?: Prisma.LabOrderUpsertWithWhereUniqueWithoutDiagnosticInput | Prisma.LabOrderUpsertWithWhereUniqueWithoutDiagnosticInput[];
    createMany?: Prisma.LabOrderCreateManyDiagnosticInputEnvelope;
    set?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    disconnect?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    delete?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    connect?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    update?: Prisma.LabOrderUpdateWithWhereUniqueWithoutDiagnosticInput | Prisma.LabOrderUpdateWithWhereUniqueWithoutDiagnosticInput[];
    updateMany?: Prisma.LabOrderUpdateManyWithWhereWithoutDiagnosticInput | Prisma.LabOrderUpdateManyWithWhereWithoutDiagnosticInput[];
    deleteMany?: Prisma.LabOrderScalarWhereInput | Prisma.LabOrderScalarWhereInput[];
};
export type LabOrderCreateNestedManyWithoutAppointmentInput = {
    create?: Prisma.XOR<Prisma.LabOrderCreateWithoutAppointmentInput, Prisma.LabOrderUncheckedCreateWithoutAppointmentInput> | Prisma.LabOrderCreateWithoutAppointmentInput[] | Prisma.LabOrderUncheckedCreateWithoutAppointmentInput[];
    connectOrCreate?: Prisma.LabOrderCreateOrConnectWithoutAppointmentInput | Prisma.LabOrderCreateOrConnectWithoutAppointmentInput[];
    createMany?: Prisma.LabOrderCreateManyAppointmentInputEnvelope;
    connect?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
};
export type LabOrderUncheckedCreateNestedManyWithoutAppointmentInput = {
    create?: Prisma.XOR<Prisma.LabOrderCreateWithoutAppointmentInput, Prisma.LabOrderUncheckedCreateWithoutAppointmentInput> | Prisma.LabOrderCreateWithoutAppointmentInput[] | Prisma.LabOrderUncheckedCreateWithoutAppointmentInput[];
    connectOrCreate?: Prisma.LabOrderCreateOrConnectWithoutAppointmentInput | Prisma.LabOrderCreateOrConnectWithoutAppointmentInput[];
    createMany?: Prisma.LabOrderCreateManyAppointmentInputEnvelope;
    connect?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
};
export type LabOrderUpdateManyWithoutAppointmentNestedInput = {
    create?: Prisma.XOR<Prisma.LabOrderCreateWithoutAppointmentInput, Prisma.LabOrderUncheckedCreateWithoutAppointmentInput> | Prisma.LabOrderCreateWithoutAppointmentInput[] | Prisma.LabOrderUncheckedCreateWithoutAppointmentInput[];
    connectOrCreate?: Prisma.LabOrderCreateOrConnectWithoutAppointmentInput | Prisma.LabOrderCreateOrConnectWithoutAppointmentInput[];
    upsert?: Prisma.LabOrderUpsertWithWhereUniqueWithoutAppointmentInput | Prisma.LabOrderUpsertWithWhereUniqueWithoutAppointmentInput[];
    createMany?: Prisma.LabOrderCreateManyAppointmentInputEnvelope;
    set?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    disconnect?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    delete?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    connect?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    update?: Prisma.LabOrderUpdateWithWhereUniqueWithoutAppointmentInput | Prisma.LabOrderUpdateWithWhereUniqueWithoutAppointmentInput[];
    updateMany?: Prisma.LabOrderUpdateManyWithWhereWithoutAppointmentInput | Prisma.LabOrderUpdateManyWithWhereWithoutAppointmentInput[];
    deleteMany?: Prisma.LabOrderScalarWhereInput | Prisma.LabOrderScalarWhereInput[];
};
export type LabOrderUncheckedUpdateManyWithoutAppointmentNestedInput = {
    create?: Prisma.XOR<Prisma.LabOrderCreateWithoutAppointmentInput, Prisma.LabOrderUncheckedCreateWithoutAppointmentInput> | Prisma.LabOrderCreateWithoutAppointmentInput[] | Prisma.LabOrderUncheckedCreateWithoutAppointmentInput[];
    connectOrCreate?: Prisma.LabOrderCreateOrConnectWithoutAppointmentInput | Prisma.LabOrderCreateOrConnectWithoutAppointmentInput[];
    upsert?: Prisma.LabOrderUpsertWithWhereUniqueWithoutAppointmentInput | Prisma.LabOrderUpsertWithWhereUniqueWithoutAppointmentInput[];
    createMany?: Prisma.LabOrderCreateManyAppointmentInputEnvelope;
    set?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    disconnect?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    delete?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    connect?: Prisma.LabOrderWhereUniqueInput | Prisma.LabOrderWhereUniqueInput[];
    update?: Prisma.LabOrderUpdateWithWhereUniqueWithoutAppointmentInput | Prisma.LabOrderUpdateWithWhereUniqueWithoutAppointmentInput[];
    updateMany?: Prisma.LabOrderUpdateManyWithWhereWithoutAppointmentInput | Prisma.LabOrderUpdateManyWithWhereWithoutAppointmentInput[];
    deleteMany?: Prisma.LabOrderScalarWhereInput | Prisma.LabOrderScalarWhereInput[];
};
export type EnumLabOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.LabOrderStatus;
};
export type LabOrderCreateNestedOneWithoutLabResultInput = {
    create?: Prisma.XOR<Prisma.LabOrderCreateWithoutLabResultInput, Prisma.LabOrderUncheckedCreateWithoutLabResultInput>;
    connectOrCreate?: Prisma.LabOrderCreateOrConnectWithoutLabResultInput;
    connect?: Prisma.LabOrderWhereUniqueInput;
};
export type LabOrderUpdateOneRequiredWithoutLabResultNestedInput = {
    create?: Prisma.XOR<Prisma.LabOrderCreateWithoutLabResultInput, Prisma.LabOrderUncheckedCreateWithoutLabResultInput>;
    connectOrCreate?: Prisma.LabOrderCreateOrConnectWithoutLabResultInput;
    upsert?: Prisma.LabOrderUpsertWithoutLabResultInput;
    connect?: Prisma.LabOrderWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LabOrderUpdateToOneWithWhereWithoutLabResultInput, Prisma.LabOrderUpdateWithoutLabResultInput>, Prisma.LabOrderUncheckedUpdateWithoutLabResultInput>;
};
export type LabOrderCreateWithoutDiagnosticInput = {
    id?: string;
    status?: $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    appointment: Prisma.AppointmentCreateNestedOneWithoutLabOrdersInput;
    labResult?: Prisma.LabResultCreateNestedOneWithoutLabOrderInput;
};
export type LabOrderUncheckedCreateWithoutDiagnosticInput = {
    id?: string;
    appointmentId: string;
    status?: $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    labResult?: Prisma.LabResultUncheckedCreateNestedOneWithoutLabOrderInput;
};
export type LabOrderCreateOrConnectWithoutDiagnosticInput = {
    where: Prisma.LabOrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.LabOrderCreateWithoutDiagnosticInput, Prisma.LabOrderUncheckedCreateWithoutDiagnosticInput>;
};
export type LabOrderCreateManyDiagnosticInputEnvelope = {
    data: Prisma.LabOrderCreateManyDiagnosticInput | Prisma.LabOrderCreateManyDiagnosticInput[];
    skipDuplicates?: boolean;
};
export type LabOrderUpsertWithWhereUniqueWithoutDiagnosticInput = {
    where: Prisma.LabOrderWhereUniqueInput;
    update: Prisma.XOR<Prisma.LabOrderUpdateWithoutDiagnosticInput, Prisma.LabOrderUncheckedUpdateWithoutDiagnosticInput>;
    create: Prisma.XOR<Prisma.LabOrderCreateWithoutDiagnosticInput, Prisma.LabOrderUncheckedCreateWithoutDiagnosticInput>;
};
export type LabOrderUpdateWithWhereUniqueWithoutDiagnosticInput = {
    where: Prisma.LabOrderWhereUniqueInput;
    data: Prisma.XOR<Prisma.LabOrderUpdateWithoutDiagnosticInput, Prisma.LabOrderUncheckedUpdateWithoutDiagnosticInput>;
};
export type LabOrderUpdateManyWithWhereWithoutDiagnosticInput = {
    where: Prisma.LabOrderScalarWhereInput;
    data: Prisma.XOR<Prisma.LabOrderUpdateManyMutationInput, Prisma.LabOrderUncheckedUpdateManyWithoutDiagnosticInput>;
};
export type LabOrderScalarWhereInput = {
    AND?: Prisma.LabOrderScalarWhereInput | Prisma.LabOrderScalarWhereInput[];
    OR?: Prisma.LabOrderScalarWhereInput[];
    NOT?: Prisma.LabOrderScalarWhereInput | Prisma.LabOrderScalarWhereInput[];
    id?: Prisma.StringFilter<"LabOrder"> | string;
    appointmentId?: Prisma.StringFilter<"LabOrder"> | string;
    diagnosticId?: Prisma.StringFilter<"LabOrder"> | string;
    status?: Prisma.EnumLabOrderStatusFilter<"LabOrder"> | $Enums.LabOrderStatus;
    tests?: Prisma.JsonNullableFilter<"LabOrder">;
    createdAt?: Prisma.DateTimeFilter<"LabOrder"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LabOrder"> | Date | string;
};
export type LabOrderCreateWithoutAppointmentInput = {
    id?: string;
    status?: $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    diagnostic: Prisma.UserCreateNestedOneWithoutDiagnosticLabOrdersInput;
    labResult?: Prisma.LabResultCreateNestedOneWithoutLabOrderInput;
};
export type LabOrderUncheckedCreateWithoutAppointmentInput = {
    id?: string;
    diagnosticId: string;
    status?: $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    labResult?: Prisma.LabResultUncheckedCreateNestedOneWithoutLabOrderInput;
};
export type LabOrderCreateOrConnectWithoutAppointmentInput = {
    where: Prisma.LabOrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.LabOrderCreateWithoutAppointmentInput, Prisma.LabOrderUncheckedCreateWithoutAppointmentInput>;
};
export type LabOrderCreateManyAppointmentInputEnvelope = {
    data: Prisma.LabOrderCreateManyAppointmentInput | Prisma.LabOrderCreateManyAppointmentInput[];
    skipDuplicates?: boolean;
};
export type LabOrderUpsertWithWhereUniqueWithoutAppointmentInput = {
    where: Prisma.LabOrderWhereUniqueInput;
    update: Prisma.XOR<Prisma.LabOrderUpdateWithoutAppointmentInput, Prisma.LabOrderUncheckedUpdateWithoutAppointmentInput>;
    create: Prisma.XOR<Prisma.LabOrderCreateWithoutAppointmentInput, Prisma.LabOrderUncheckedCreateWithoutAppointmentInput>;
};
export type LabOrderUpdateWithWhereUniqueWithoutAppointmentInput = {
    where: Prisma.LabOrderWhereUniqueInput;
    data: Prisma.XOR<Prisma.LabOrderUpdateWithoutAppointmentInput, Prisma.LabOrderUncheckedUpdateWithoutAppointmentInput>;
};
export type LabOrderUpdateManyWithWhereWithoutAppointmentInput = {
    where: Prisma.LabOrderScalarWhereInput;
    data: Prisma.XOR<Prisma.LabOrderUpdateManyMutationInput, Prisma.LabOrderUncheckedUpdateManyWithoutAppointmentInput>;
};
export type LabOrderCreateWithoutLabResultInput = {
    id?: string;
    status?: $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    appointment: Prisma.AppointmentCreateNestedOneWithoutLabOrdersInput;
    diagnostic: Prisma.UserCreateNestedOneWithoutDiagnosticLabOrdersInput;
};
export type LabOrderUncheckedCreateWithoutLabResultInput = {
    id?: string;
    appointmentId: string;
    diagnosticId: string;
    status?: $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LabOrderCreateOrConnectWithoutLabResultInput = {
    where: Prisma.LabOrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.LabOrderCreateWithoutLabResultInput, Prisma.LabOrderUncheckedCreateWithoutLabResultInput>;
};
export type LabOrderUpsertWithoutLabResultInput = {
    update: Prisma.XOR<Prisma.LabOrderUpdateWithoutLabResultInput, Prisma.LabOrderUncheckedUpdateWithoutLabResultInput>;
    create: Prisma.XOR<Prisma.LabOrderCreateWithoutLabResultInput, Prisma.LabOrderUncheckedCreateWithoutLabResultInput>;
    where?: Prisma.LabOrderWhereInput;
};
export type LabOrderUpdateToOneWithWhereWithoutLabResultInput = {
    where?: Prisma.LabOrderWhereInput;
    data: Prisma.XOR<Prisma.LabOrderUpdateWithoutLabResultInput, Prisma.LabOrderUncheckedUpdateWithoutLabResultInput>;
};
export type LabOrderUpdateWithoutLabResultInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumLabOrderStatusFieldUpdateOperationsInput | $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    appointment?: Prisma.AppointmentUpdateOneRequiredWithoutLabOrdersNestedInput;
    diagnostic?: Prisma.UserUpdateOneRequiredWithoutDiagnosticLabOrdersNestedInput;
};
export type LabOrderUncheckedUpdateWithoutLabResultInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    appointmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    diagnosticId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumLabOrderStatusFieldUpdateOperationsInput | $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LabOrderCreateManyDiagnosticInput = {
    id?: string;
    appointmentId: string;
    status?: $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LabOrderUpdateWithoutDiagnosticInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumLabOrderStatusFieldUpdateOperationsInput | $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    appointment?: Prisma.AppointmentUpdateOneRequiredWithoutLabOrdersNestedInput;
    labResult?: Prisma.LabResultUpdateOneWithoutLabOrderNestedInput;
};
export type LabOrderUncheckedUpdateWithoutDiagnosticInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    appointmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumLabOrderStatusFieldUpdateOperationsInput | $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    labResult?: Prisma.LabResultUncheckedUpdateOneWithoutLabOrderNestedInput;
};
export type LabOrderUncheckedUpdateManyWithoutDiagnosticInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    appointmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumLabOrderStatusFieldUpdateOperationsInput | $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LabOrderCreateManyAppointmentInput = {
    id?: string;
    diagnosticId: string;
    status?: $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LabOrderUpdateWithoutAppointmentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumLabOrderStatusFieldUpdateOperationsInput | $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    diagnostic?: Prisma.UserUpdateOneRequiredWithoutDiagnosticLabOrdersNestedInput;
    labResult?: Prisma.LabResultUpdateOneWithoutLabOrderNestedInput;
};
export type LabOrderUncheckedUpdateWithoutAppointmentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    diagnosticId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumLabOrderStatusFieldUpdateOperationsInput | $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    labResult?: Prisma.LabResultUncheckedUpdateOneWithoutLabOrderNestedInput;
};
export type LabOrderUncheckedUpdateManyWithoutAppointmentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    diagnosticId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumLabOrderStatusFieldUpdateOperationsInput | $Enums.LabOrderStatus;
    tests?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LabOrderSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    appointmentId?: boolean;
    diagnosticId?: boolean;
    status?: boolean;
    tests?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    appointment?: boolean | Prisma.AppointmentDefaultArgs<ExtArgs>;
    diagnostic?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    labResult?: boolean | Prisma.LabOrder$labResultArgs<ExtArgs>;
}, ExtArgs["result"]["labOrder"]>;
export type LabOrderSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    appointmentId?: boolean;
    diagnosticId?: boolean;
    status?: boolean;
    tests?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    appointment?: boolean | Prisma.AppointmentDefaultArgs<ExtArgs>;
    diagnostic?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["labOrder"]>;
export type LabOrderSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    appointmentId?: boolean;
    diagnosticId?: boolean;
    status?: boolean;
    tests?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    appointment?: boolean | Prisma.AppointmentDefaultArgs<ExtArgs>;
    diagnostic?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["labOrder"]>;
export type LabOrderSelectScalar = {
    id?: boolean;
    appointmentId?: boolean;
    diagnosticId?: boolean;
    status?: boolean;
    tests?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type LabOrderOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "appointmentId" | "diagnosticId" | "status" | "tests" | "createdAt" | "updatedAt", ExtArgs["result"]["labOrder"]>;
export type LabOrderInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    appointment?: boolean | Prisma.AppointmentDefaultArgs<ExtArgs>;
    diagnostic?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    labResult?: boolean | Prisma.LabOrder$labResultArgs<ExtArgs>;
};
export type LabOrderIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    appointment?: boolean | Prisma.AppointmentDefaultArgs<ExtArgs>;
    diagnostic?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type LabOrderIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    appointment?: boolean | Prisma.AppointmentDefaultArgs<ExtArgs>;
    diagnostic?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $LabOrderPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LabOrder";
    objects: {
        appointment: Prisma.$AppointmentPayload<ExtArgs>;
        diagnostic: Prisma.$UserPayload<ExtArgs>;
        labResult: Prisma.$LabResultPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        appointmentId: string;
        diagnosticId: string;
        status: $Enums.LabOrderStatus;
        tests: runtime.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["labOrder"]>;
    composites: {};
};
export type LabOrderGetPayload<S extends boolean | null | undefined | LabOrderDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LabOrderPayload, S>;
export type LabOrderCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LabOrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LabOrderCountAggregateInputType | true;
};
export interface LabOrderDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LabOrder'];
        meta: {
            name: 'LabOrder';
        };
    };
    findUnique<T extends LabOrderFindUniqueArgs>(args: Prisma.SelectSubset<T, LabOrderFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LabOrderClient<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LabOrderFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LabOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LabOrderClient<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LabOrderFindFirstArgs>(args?: Prisma.SelectSubset<T, LabOrderFindFirstArgs<ExtArgs>>): Prisma.Prisma__LabOrderClient<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LabOrderFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LabOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LabOrderClient<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LabOrderFindManyArgs>(args?: Prisma.SelectSubset<T, LabOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LabOrderCreateArgs>(args: Prisma.SelectSubset<T, LabOrderCreateArgs<ExtArgs>>): Prisma.Prisma__LabOrderClient<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LabOrderCreateManyArgs>(args?: Prisma.SelectSubset<T, LabOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LabOrderCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LabOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LabOrderDeleteArgs>(args: Prisma.SelectSubset<T, LabOrderDeleteArgs<ExtArgs>>): Prisma.Prisma__LabOrderClient<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LabOrderUpdateArgs>(args: Prisma.SelectSubset<T, LabOrderUpdateArgs<ExtArgs>>): Prisma.Prisma__LabOrderClient<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LabOrderDeleteManyArgs>(args?: Prisma.SelectSubset<T, LabOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LabOrderUpdateManyArgs>(args: Prisma.SelectSubset<T, LabOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LabOrderUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LabOrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LabOrderUpsertArgs>(args: Prisma.SelectSubset<T, LabOrderUpsertArgs<ExtArgs>>): Prisma.Prisma__LabOrderClient<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LabOrderCountArgs>(args?: Prisma.Subset<T, LabOrderCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LabOrderCountAggregateOutputType> : number>;
    aggregate<T extends LabOrderAggregateArgs>(args: Prisma.Subset<T, LabOrderAggregateArgs>): Prisma.PrismaPromise<GetLabOrderAggregateType<T>>;
    groupBy<T extends LabOrderGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LabOrderGroupByArgs['orderBy'];
    } : {
        orderBy?: LabOrderGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LabOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LabOrderFieldRefs;
}
export interface Prisma__LabOrderClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    appointment<T extends Prisma.AppointmentDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AppointmentDefaultArgs<ExtArgs>>): Prisma.Prisma__AppointmentClient<runtime.Types.Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    diagnostic<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    labResult<T extends Prisma.LabOrder$labResultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LabOrder$labResultArgs<ExtArgs>>): Prisma.Prisma__LabResultClient<runtime.Types.Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LabOrderFieldRefs {
    readonly id: Prisma.FieldRef<"LabOrder", 'String'>;
    readonly appointmentId: Prisma.FieldRef<"LabOrder", 'String'>;
    readonly diagnosticId: Prisma.FieldRef<"LabOrder", 'String'>;
    readonly status: Prisma.FieldRef<"LabOrder", 'LabOrderStatus'>;
    readonly tests: Prisma.FieldRef<"LabOrder", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"LabOrder", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"LabOrder", 'DateTime'>;
}
export type LabOrderFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabOrderSelect<ExtArgs> | null;
    omit?: Prisma.LabOrderOmit<ExtArgs> | null;
    include?: Prisma.LabOrderInclude<ExtArgs> | null;
    where: Prisma.LabOrderWhereUniqueInput;
};
export type LabOrderFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabOrderSelect<ExtArgs> | null;
    omit?: Prisma.LabOrderOmit<ExtArgs> | null;
    include?: Prisma.LabOrderInclude<ExtArgs> | null;
    where: Prisma.LabOrderWhereUniqueInput;
};
export type LabOrderFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LabOrderFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LabOrderFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LabOrderCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabOrderSelect<ExtArgs> | null;
    omit?: Prisma.LabOrderOmit<ExtArgs> | null;
    include?: Prisma.LabOrderInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LabOrderCreateInput, Prisma.LabOrderUncheckedCreateInput>;
};
export type LabOrderCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LabOrderCreateManyInput | Prisma.LabOrderCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LabOrderCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabOrderSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LabOrderOmit<ExtArgs> | null;
    data: Prisma.LabOrderCreateManyInput | Prisma.LabOrderCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LabOrderIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LabOrderUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabOrderSelect<ExtArgs> | null;
    omit?: Prisma.LabOrderOmit<ExtArgs> | null;
    include?: Prisma.LabOrderInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LabOrderUpdateInput, Prisma.LabOrderUncheckedUpdateInput>;
    where: Prisma.LabOrderWhereUniqueInput;
};
export type LabOrderUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LabOrderUpdateManyMutationInput, Prisma.LabOrderUncheckedUpdateManyInput>;
    where?: Prisma.LabOrderWhereInput;
    limit?: number;
};
export type LabOrderUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabOrderSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LabOrderOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LabOrderUpdateManyMutationInput, Prisma.LabOrderUncheckedUpdateManyInput>;
    where?: Prisma.LabOrderWhereInput;
    limit?: number;
    include?: Prisma.LabOrderIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LabOrderUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabOrderSelect<ExtArgs> | null;
    omit?: Prisma.LabOrderOmit<ExtArgs> | null;
    include?: Prisma.LabOrderInclude<ExtArgs> | null;
    where: Prisma.LabOrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.LabOrderCreateInput, Prisma.LabOrderUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LabOrderUpdateInput, Prisma.LabOrderUncheckedUpdateInput>;
};
export type LabOrderDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabOrderSelect<ExtArgs> | null;
    omit?: Prisma.LabOrderOmit<ExtArgs> | null;
    include?: Prisma.LabOrderInclude<ExtArgs> | null;
    where: Prisma.LabOrderWhereUniqueInput;
};
export type LabOrderDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LabOrderWhereInput;
    limit?: number;
};
export type LabOrder$labResultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelect<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    include?: Prisma.LabResultInclude<ExtArgs> | null;
    where?: Prisma.LabResultWhereInput;
};
export type LabOrderDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabOrderSelect<ExtArgs> | null;
    omit?: Prisma.LabOrderOmit<ExtArgs> | null;
    include?: Prisma.LabOrderInclude<ExtArgs> | null;
};
export {};
