import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type PasswordResetCodeModel = runtime.Types.Result.DefaultSelection<Prisma.$PasswordResetCodePayload>;
export type AggregatePasswordResetCode = {
    _count: PasswordResetCodeCountAggregateOutputType | null;
    _avg: PasswordResetCodeAvgAggregateOutputType | null;
    _sum: PasswordResetCodeSumAggregateOutputType | null;
    _min: PasswordResetCodeMinAggregateOutputType | null;
    _max: PasswordResetCodeMaxAggregateOutputType | null;
};
export type PasswordResetCodeAvgAggregateOutputType = {
    attemptCount: number | null;
};
export type PasswordResetCodeSumAggregateOutputType = {
    attemptCount: number | null;
};
export type PasswordResetCodeMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    email: string | null;
    codeHash: string | null;
    expiresAt: Date | null;
    consumedAt: Date | null;
    attemptCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PasswordResetCodeMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    email: string | null;
    codeHash: string | null;
    expiresAt: Date | null;
    consumedAt: Date | null;
    attemptCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PasswordResetCodeCountAggregateOutputType = {
    id: number;
    userId: number;
    email: number;
    codeHash: number;
    expiresAt: number;
    consumedAt: number;
    attemptCount: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PasswordResetCodeAvgAggregateInputType = {
    attemptCount?: true;
};
export type PasswordResetCodeSumAggregateInputType = {
    attemptCount?: true;
};
export type PasswordResetCodeMinAggregateInputType = {
    id?: true;
    userId?: true;
    email?: true;
    codeHash?: true;
    expiresAt?: true;
    consumedAt?: true;
    attemptCount?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PasswordResetCodeMaxAggregateInputType = {
    id?: true;
    userId?: true;
    email?: true;
    codeHash?: true;
    expiresAt?: true;
    consumedAt?: true;
    attemptCount?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PasswordResetCodeCountAggregateInputType = {
    id?: true;
    userId?: true;
    email?: true;
    codeHash?: true;
    expiresAt?: true;
    consumedAt?: true;
    attemptCount?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PasswordResetCodeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PasswordResetCodeWhereInput;
    orderBy?: Prisma.PasswordResetCodeOrderByWithRelationInput | Prisma.PasswordResetCodeOrderByWithRelationInput[];
    cursor?: Prisma.PasswordResetCodeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PasswordResetCodeCountAggregateInputType;
    _avg?: PasswordResetCodeAvgAggregateInputType;
    _sum?: PasswordResetCodeSumAggregateInputType;
    _min?: PasswordResetCodeMinAggregateInputType;
    _max?: PasswordResetCodeMaxAggregateInputType;
};
export type GetPasswordResetCodeAggregateType<T extends PasswordResetCodeAggregateArgs> = {
    [P in keyof T & keyof AggregatePasswordResetCode]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePasswordResetCode[P]> : Prisma.GetScalarType<T[P], AggregatePasswordResetCode[P]>;
};
export type PasswordResetCodeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PasswordResetCodeWhereInput;
    orderBy?: Prisma.PasswordResetCodeOrderByWithAggregationInput | Prisma.PasswordResetCodeOrderByWithAggregationInput[];
    by: Prisma.PasswordResetCodeScalarFieldEnum[] | Prisma.PasswordResetCodeScalarFieldEnum;
    having?: Prisma.PasswordResetCodeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PasswordResetCodeCountAggregateInputType | true;
    _avg?: PasswordResetCodeAvgAggregateInputType;
    _sum?: PasswordResetCodeSumAggregateInputType;
    _min?: PasswordResetCodeMinAggregateInputType;
    _max?: PasswordResetCodeMaxAggregateInputType;
};
export type PasswordResetCodeGroupByOutputType = {
    id: string;
    userId: string | null;
    email: string;
    codeHash: string;
    expiresAt: Date;
    consumedAt: Date | null;
    attemptCount: number;
    createdAt: Date;
    updatedAt: Date;
    _count: PasswordResetCodeCountAggregateOutputType | null;
    _avg: PasswordResetCodeAvgAggregateOutputType | null;
    _sum: PasswordResetCodeSumAggregateOutputType | null;
    _min: PasswordResetCodeMinAggregateOutputType | null;
    _max: PasswordResetCodeMaxAggregateOutputType | null;
};
export type GetPasswordResetCodeGroupByPayload<T extends PasswordResetCodeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PasswordResetCodeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PasswordResetCodeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PasswordResetCodeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PasswordResetCodeGroupByOutputType[P]>;
}>>;
export type PasswordResetCodeWhereInput = {
    AND?: Prisma.PasswordResetCodeWhereInput | Prisma.PasswordResetCodeWhereInput[];
    OR?: Prisma.PasswordResetCodeWhereInput[];
    NOT?: Prisma.PasswordResetCodeWhereInput | Prisma.PasswordResetCodeWhereInput[];
    id?: Prisma.StringFilter<"PasswordResetCode"> | string;
    userId?: Prisma.StringNullableFilter<"PasswordResetCode"> | string | null;
    email?: Prisma.StringFilter<"PasswordResetCode"> | string;
    codeHash?: Prisma.StringFilter<"PasswordResetCode"> | string;
    expiresAt?: Prisma.DateTimeFilter<"PasswordResetCode"> | Date | string;
    consumedAt?: Prisma.DateTimeNullableFilter<"PasswordResetCode"> | Date | string | null;
    attemptCount?: Prisma.IntFilter<"PasswordResetCode"> | number;
    createdAt?: Prisma.DateTimeFilter<"PasswordResetCode"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PasswordResetCode"> | Date | string;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type PasswordResetCodeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    consumedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    attemptCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type PasswordResetCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PasswordResetCodeWhereInput | Prisma.PasswordResetCodeWhereInput[];
    OR?: Prisma.PasswordResetCodeWhereInput[];
    NOT?: Prisma.PasswordResetCodeWhereInput | Prisma.PasswordResetCodeWhereInput[];
    userId?: Prisma.StringNullableFilter<"PasswordResetCode"> | string | null;
    email?: Prisma.StringFilter<"PasswordResetCode"> | string;
    codeHash?: Prisma.StringFilter<"PasswordResetCode"> | string;
    expiresAt?: Prisma.DateTimeFilter<"PasswordResetCode"> | Date | string;
    consumedAt?: Prisma.DateTimeNullableFilter<"PasswordResetCode"> | Date | string | null;
    attemptCount?: Prisma.IntFilter<"PasswordResetCode"> | number;
    createdAt?: Prisma.DateTimeFilter<"PasswordResetCode"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PasswordResetCode"> | Date | string;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type PasswordResetCodeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    consumedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    attemptCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PasswordResetCodeCountOrderByAggregateInput;
    _avg?: Prisma.PasswordResetCodeAvgOrderByAggregateInput;
    _max?: Prisma.PasswordResetCodeMaxOrderByAggregateInput;
    _min?: Prisma.PasswordResetCodeMinOrderByAggregateInput;
    _sum?: Prisma.PasswordResetCodeSumOrderByAggregateInput;
};
export type PasswordResetCodeScalarWhereWithAggregatesInput = {
    AND?: Prisma.PasswordResetCodeScalarWhereWithAggregatesInput | Prisma.PasswordResetCodeScalarWhereWithAggregatesInput[];
    OR?: Prisma.PasswordResetCodeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PasswordResetCodeScalarWhereWithAggregatesInput | Prisma.PasswordResetCodeScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PasswordResetCode"> | string;
    userId?: Prisma.StringNullableWithAggregatesFilter<"PasswordResetCode"> | string | null;
    email?: Prisma.StringWithAggregatesFilter<"PasswordResetCode"> | string;
    codeHash?: Prisma.StringWithAggregatesFilter<"PasswordResetCode"> | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"PasswordResetCode"> | Date | string;
    consumedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PasswordResetCode"> | Date | string | null;
    attemptCount?: Prisma.IntWithAggregatesFilter<"PasswordResetCode"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PasswordResetCode"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PasswordResetCode"> | Date | string;
};
export type PasswordResetCodeCreateInput = {
    id?: string;
    email: string;
    codeHash: string;
    expiresAt: Date | string;
    consumedAt?: Date | string | null;
    attemptCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user?: Prisma.UserCreateNestedOneWithoutPasswordResetCodesInput;
};
export type PasswordResetCodeUncheckedCreateInput = {
    id?: string;
    userId?: string | null;
    email: string;
    codeHash: string;
    expiresAt: Date | string;
    consumedAt?: Date | string | null;
    attemptCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PasswordResetCodeUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    consumedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    attemptCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneWithoutPasswordResetCodesNestedInput;
};
export type PasswordResetCodeUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    consumedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    attemptCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PasswordResetCodeCreateManyInput = {
    id?: string;
    userId?: string | null;
    email: string;
    codeHash: string;
    expiresAt: Date | string;
    consumedAt?: Date | string | null;
    attemptCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PasswordResetCodeUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    consumedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    attemptCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PasswordResetCodeUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    consumedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    attemptCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PasswordResetCodeListRelationFilter = {
    every?: Prisma.PasswordResetCodeWhereInput;
    some?: Prisma.PasswordResetCodeWhereInput;
    none?: Prisma.PasswordResetCodeWhereInput;
};
export type PasswordResetCodeOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PasswordResetCodeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    consumedAt?: Prisma.SortOrder;
    attemptCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PasswordResetCodeAvgOrderByAggregateInput = {
    attemptCount?: Prisma.SortOrder;
};
export type PasswordResetCodeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    consumedAt?: Prisma.SortOrder;
    attemptCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PasswordResetCodeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    codeHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    consumedAt?: Prisma.SortOrder;
    attemptCount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PasswordResetCodeSumOrderByAggregateInput = {
    attemptCount?: Prisma.SortOrder;
};
export type PasswordResetCodeCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PasswordResetCodeCreateWithoutUserInput, Prisma.PasswordResetCodeUncheckedCreateWithoutUserInput> | Prisma.PasswordResetCodeCreateWithoutUserInput[] | Prisma.PasswordResetCodeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PasswordResetCodeCreateOrConnectWithoutUserInput | Prisma.PasswordResetCodeCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.PasswordResetCodeCreateManyUserInputEnvelope;
    connect?: Prisma.PasswordResetCodeWhereUniqueInput | Prisma.PasswordResetCodeWhereUniqueInput[];
};
export type PasswordResetCodeUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PasswordResetCodeCreateWithoutUserInput, Prisma.PasswordResetCodeUncheckedCreateWithoutUserInput> | Prisma.PasswordResetCodeCreateWithoutUserInput[] | Prisma.PasswordResetCodeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PasswordResetCodeCreateOrConnectWithoutUserInput | Prisma.PasswordResetCodeCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.PasswordResetCodeCreateManyUserInputEnvelope;
    connect?: Prisma.PasswordResetCodeWhereUniqueInput | Prisma.PasswordResetCodeWhereUniqueInput[];
};
export type PasswordResetCodeUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PasswordResetCodeCreateWithoutUserInput, Prisma.PasswordResetCodeUncheckedCreateWithoutUserInput> | Prisma.PasswordResetCodeCreateWithoutUserInput[] | Prisma.PasswordResetCodeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PasswordResetCodeCreateOrConnectWithoutUserInput | Prisma.PasswordResetCodeCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.PasswordResetCodeUpsertWithWhereUniqueWithoutUserInput | Prisma.PasswordResetCodeUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.PasswordResetCodeCreateManyUserInputEnvelope;
    set?: Prisma.PasswordResetCodeWhereUniqueInput | Prisma.PasswordResetCodeWhereUniqueInput[];
    disconnect?: Prisma.PasswordResetCodeWhereUniqueInput | Prisma.PasswordResetCodeWhereUniqueInput[];
    delete?: Prisma.PasswordResetCodeWhereUniqueInput | Prisma.PasswordResetCodeWhereUniqueInput[];
    connect?: Prisma.PasswordResetCodeWhereUniqueInput | Prisma.PasswordResetCodeWhereUniqueInput[];
    update?: Prisma.PasswordResetCodeUpdateWithWhereUniqueWithoutUserInput | Prisma.PasswordResetCodeUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.PasswordResetCodeUpdateManyWithWhereWithoutUserInput | Prisma.PasswordResetCodeUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.PasswordResetCodeScalarWhereInput | Prisma.PasswordResetCodeScalarWhereInput[];
};
export type PasswordResetCodeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PasswordResetCodeCreateWithoutUserInput, Prisma.PasswordResetCodeUncheckedCreateWithoutUserInput> | Prisma.PasswordResetCodeCreateWithoutUserInput[] | Prisma.PasswordResetCodeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PasswordResetCodeCreateOrConnectWithoutUserInput | Prisma.PasswordResetCodeCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.PasswordResetCodeUpsertWithWhereUniqueWithoutUserInput | Prisma.PasswordResetCodeUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.PasswordResetCodeCreateManyUserInputEnvelope;
    set?: Prisma.PasswordResetCodeWhereUniqueInput | Prisma.PasswordResetCodeWhereUniqueInput[];
    disconnect?: Prisma.PasswordResetCodeWhereUniqueInput | Prisma.PasswordResetCodeWhereUniqueInput[];
    delete?: Prisma.PasswordResetCodeWhereUniqueInput | Prisma.PasswordResetCodeWhereUniqueInput[];
    connect?: Prisma.PasswordResetCodeWhereUniqueInput | Prisma.PasswordResetCodeWhereUniqueInput[];
    update?: Prisma.PasswordResetCodeUpdateWithWhereUniqueWithoutUserInput | Prisma.PasswordResetCodeUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.PasswordResetCodeUpdateManyWithWhereWithoutUserInput | Prisma.PasswordResetCodeUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.PasswordResetCodeScalarWhereInput | Prisma.PasswordResetCodeScalarWhereInput[];
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type PasswordResetCodeCreateWithoutUserInput = {
    id?: string;
    email: string;
    codeHash: string;
    expiresAt: Date | string;
    consumedAt?: Date | string | null;
    attemptCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PasswordResetCodeUncheckedCreateWithoutUserInput = {
    id?: string;
    email: string;
    codeHash: string;
    expiresAt: Date | string;
    consumedAt?: Date | string | null;
    attemptCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PasswordResetCodeCreateOrConnectWithoutUserInput = {
    where: Prisma.PasswordResetCodeWhereUniqueInput;
    create: Prisma.XOR<Prisma.PasswordResetCodeCreateWithoutUserInput, Prisma.PasswordResetCodeUncheckedCreateWithoutUserInput>;
};
export type PasswordResetCodeCreateManyUserInputEnvelope = {
    data: Prisma.PasswordResetCodeCreateManyUserInput | Prisma.PasswordResetCodeCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type PasswordResetCodeUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.PasswordResetCodeWhereUniqueInput;
    update: Prisma.XOR<Prisma.PasswordResetCodeUpdateWithoutUserInput, Prisma.PasswordResetCodeUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.PasswordResetCodeCreateWithoutUserInput, Prisma.PasswordResetCodeUncheckedCreateWithoutUserInput>;
};
export type PasswordResetCodeUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.PasswordResetCodeWhereUniqueInput;
    data: Prisma.XOR<Prisma.PasswordResetCodeUpdateWithoutUserInput, Prisma.PasswordResetCodeUncheckedUpdateWithoutUserInput>;
};
export type PasswordResetCodeUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.PasswordResetCodeScalarWhereInput;
    data: Prisma.XOR<Prisma.PasswordResetCodeUpdateManyMutationInput, Prisma.PasswordResetCodeUncheckedUpdateManyWithoutUserInput>;
};
export type PasswordResetCodeScalarWhereInput = {
    AND?: Prisma.PasswordResetCodeScalarWhereInput | Prisma.PasswordResetCodeScalarWhereInput[];
    OR?: Prisma.PasswordResetCodeScalarWhereInput[];
    NOT?: Prisma.PasswordResetCodeScalarWhereInput | Prisma.PasswordResetCodeScalarWhereInput[];
    id?: Prisma.StringFilter<"PasswordResetCode"> | string;
    userId?: Prisma.StringNullableFilter<"PasswordResetCode"> | string | null;
    email?: Prisma.StringFilter<"PasswordResetCode"> | string;
    codeHash?: Prisma.StringFilter<"PasswordResetCode"> | string;
    expiresAt?: Prisma.DateTimeFilter<"PasswordResetCode"> | Date | string;
    consumedAt?: Prisma.DateTimeNullableFilter<"PasswordResetCode"> | Date | string | null;
    attemptCount?: Prisma.IntFilter<"PasswordResetCode"> | number;
    createdAt?: Prisma.DateTimeFilter<"PasswordResetCode"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PasswordResetCode"> | Date | string;
};
export type PasswordResetCodeCreateManyUserInput = {
    id?: string;
    email: string;
    codeHash: string;
    expiresAt: Date | string;
    consumedAt?: Date | string | null;
    attemptCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PasswordResetCodeUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    consumedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    attemptCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PasswordResetCodeUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    consumedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    attemptCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PasswordResetCodeUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    codeHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    consumedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    attemptCount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PasswordResetCodeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    email?: boolean;
    codeHash?: boolean;
    expiresAt?: boolean;
    consumedAt?: boolean;
    attemptCount?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.PasswordResetCode$userArgs<ExtArgs>;
}, ExtArgs["result"]["passwordResetCode"]>;
export type PasswordResetCodeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    email?: boolean;
    codeHash?: boolean;
    expiresAt?: boolean;
    consumedAt?: boolean;
    attemptCount?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.PasswordResetCode$userArgs<ExtArgs>;
}, ExtArgs["result"]["passwordResetCode"]>;
export type PasswordResetCodeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    email?: boolean;
    codeHash?: boolean;
    expiresAt?: boolean;
    consumedAt?: boolean;
    attemptCount?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.PasswordResetCode$userArgs<ExtArgs>;
}, ExtArgs["result"]["passwordResetCode"]>;
export type PasswordResetCodeSelectScalar = {
    id?: boolean;
    userId?: boolean;
    email?: boolean;
    codeHash?: boolean;
    expiresAt?: boolean;
    consumedAt?: boolean;
    attemptCount?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PasswordResetCodeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "email" | "codeHash" | "expiresAt" | "consumedAt" | "attemptCount" | "createdAt" | "updatedAt", ExtArgs["result"]["passwordResetCode"]>;
export type PasswordResetCodeInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.PasswordResetCode$userArgs<ExtArgs>;
};
export type PasswordResetCodeIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.PasswordResetCode$userArgs<ExtArgs>;
};
export type PasswordResetCodeIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.PasswordResetCode$userArgs<ExtArgs>;
};
export type $PasswordResetCodePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PasswordResetCode";
    objects: {
        user: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string | null;
        email: string;
        codeHash: string;
        expiresAt: Date;
        consumedAt: Date | null;
        attemptCount: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["passwordResetCode"]>;
    composites: {};
};
export type PasswordResetCodeGetPayload<S extends boolean | null | undefined | PasswordResetCodeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PasswordResetCodePayload, S>;
export type PasswordResetCodeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PasswordResetCodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PasswordResetCodeCountAggregateInputType | true;
};
export interface PasswordResetCodeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetCode'];
        meta: {
            name: 'PasswordResetCode';
        };
    };
    findUnique<T extends PasswordResetCodeFindUniqueArgs>(args: Prisma.SelectSubset<T, PasswordResetCodeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PasswordResetCodeClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PasswordResetCodeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PasswordResetCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PasswordResetCodeClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PasswordResetCodeFindFirstArgs>(args?: Prisma.SelectSubset<T, PasswordResetCodeFindFirstArgs<ExtArgs>>): Prisma.Prisma__PasswordResetCodeClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PasswordResetCodeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PasswordResetCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PasswordResetCodeClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PasswordResetCodeFindManyArgs>(args?: Prisma.SelectSubset<T, PasswordResetCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PasswordResetCodeCreateArgs>(args: Prisma.SelectSubset<T, PasswordResetCodeCreateArgs<ExtArgs>>): Prisma.Prisma__PasswordResetCodeClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PasswordResetCodeCreateManyArgs>(args?: Prisma.SelectSubset<T, PasswordResetCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PasswordResetCodeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PasswordResetCodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PasswordResetCodeDeleteArgs>(args: Prisma.SelectSubset<T, PasswordResetCodeDeleteArgs<ExtArgs>>): Prisma.Prisma__PasswordResetCodeClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PasswordResetCodeUpdateArgs>(args: Prisma.SelectSubset<T, PasswordResetCodeUpdateArgs<ExtArgs>>): Prisma.Prisma__PasswordResetCodeClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PasswordResetCodeDeleteManyArgs>(args?: Prisma.SelectSubset<T, PasswordResetCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PasswordResetCodeUpdateManyArgs>(args: Prisma.SelectSubset<T, PasswordResetCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PasswordResetCodeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PasswordResetCodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PasswordResetCodeUpsertArgs>(args: Prisma.SelectSubset<T, PasswordResetCodeUpsertArgs<ExtArgs>>): Prisma.Prisma__PasswordResetCodeClient<runtime.Types.Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PasswordResetCodeCountArgs>(args?: Prisma.Subset<T, PasswordResetCodeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PasswordResetCodeCountAggregateOutputType> : number>;
    aggregate<T extends PasswordResetCodeAggregateArgs>(args: Prisma.Subset<T, PasswordResetCodeAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetCodeAggregateType<T>>;
    groupBy<T extends PasswordResetCodeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PasswordResetCodeGroupByArgs['orderBy'];
    } : {
        orderBy?: PasswordResetCodeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PasswordResetCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PasswordResetCodeFieldRefs;
}
export interface Prisma__PasswordResetCodeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.PasswordResetCode$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PasswordResetCode$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PasswordResetCodeFieldRefs {
    readonly id: Prisma.FieldRef<"PasswordResetCode", 'String'>;
    readonly userId: Prisma.FieldRef<"PasswordResetCode", 'String'>;
    readonly email: Prisma.FieldRef<"PasswordResetCode", 'String'>;
    readonly codeHash: Prisma.FieldRef<"PasswordResetCode", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"PasswordResetCode", 'DateTime'>;
    readonly consumedAt: Prisma.FieldRef<"PasswordResetCode", 'DateTime'>;
    readonly attemptCount: Prisma.FieldRef<"PasswordResetCode", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"PasswordResetCode", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"PasswordResetCode", 'DateTime'>;
}
export type PasswordResetCodeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetCodeSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetCodeOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetCodeInclude<ExtArgs> | null;
    where: Prisma.PasswordResetCodeWhereUniqueInput;
};
export type PasswordResetCodeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetCodeSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetCodeOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetCodeInclude<ExtArgs> | null;
    where: Prisma.PasswordResetCodeWhereUniqueInput;
};
export type PasswordResetCodeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetCodeSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetCodeOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetCodeInclude<ExtArgs> | null;
    where?: Prisma.PasswordResetCodeWhereInput;
    orderBy?: Prisma.PasswordResetCodeOrderByWithRelationInput | Prisma.PasswordResetCodeOrderByWithRelationInput[];
    cursor?: Prisma.PasswordResetCodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PasswordResetCodeScalarFieldEnum | Prisma.PasswordResetCodeScalarFieldEnum[];
};
export type PasswordResetCodeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetCodeSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetCodeOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetCodeInclude<ExtArgs> | null;
    where?: Prisma.PasswordResetCodeWhereInput;
    orderBy?: Prisma.PasswordResetCodeOrderByWithRelationInput | Prisma.PasswordResetCodeOrderByWithRelationInput[];
    cursor?: Prisma.PasswordResetCodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PasswordResetCodeScalarFieldEnum | Prisma.PasswordResetCodeScalarFieldEnum[];
};
export type PasswordResetCodeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetCodeSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetCodeOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetCodeInclude<ExtArgs> | null;
    where?: Prisma.PasswordResetCodeWhereInput;
    orderBy?: Prisma.PasswordResetCodeOrderByWithRelationInput | Prisma.PasswordResetCodeOrderByWithRelationInput[];
    cursor?: Prisma.PasswordResetCodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PasswordResetCodeScalarFieldEnum | Prisma.PasswordResetCodeScalarFieldEnum[];
};
export type PasswordResetCodeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetCodeSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetCodeOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetCodeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PasswordResetCodeCreateInput, Prisma.PasswordResetCodeUncheckedCreateInput>;
};
export type PasswordResetCodeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PasswordResetCodeCreateManyInput | Prisma.PasswordResetCodeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PasswordResetCodeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetCodeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PasswordResetCodeOmit<ExtArgs> | null;
    data: Prisma.PasswordResetCodeCreateManyInput | Prisma.PasswordResetCodeCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PasswordResetCodeIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PasswordResetCodeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetCodeSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetCodeOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetCodeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PasswordResetCodeUpdateInput, Prisma.PasswordResetCodeUncheckedUpdateInput>;
    where: Prisma.PasswordResetCodeWhereUniqueInput;
};
export type PasswordResetCodeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PasswordResetCodeUpdateManyMutationInput, Prisma.PasswordResetCodeUncheckedUpdateManyInput>;
    where?: Prisma.PasswordResetCodeWhereInput;
    limit?: number;
};
export type PasswordResetCodeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetCodeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PasswordResetCodeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PasswordResetCodeUpdateManyMutationInput, Prisma.PasswordResetCodeUncheckedUpdateManyInput>;
    where?: Prisma.PasswordResetCodeWhereInput;
    limit?: number;
    include?: Prisma.PasswordResetCodeIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PasswordResetCodeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetCodeSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetCodeOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetCodeInclude<ExtArgs> | null;
    where: Prisma.PasswordResetCodeWhereUniqueInput;
    create: Prisma.XOR<Prisma.PasswordResetCodeCreateInput, Prisma.PasswordResetCodeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PasswordResetCodeUpdateInput, Prisma.PasswordResetCodeUncheckedUpdateInput>;
};
export type PasswordResetCodeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetCodeSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetCodeOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetCodeInclude<ExtArgs> | null;
    where: Prisma.PasswordResetCodeWhereUniqueInput;
};
export type PasswordResetCodeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PasswordResetCodeWhereInput;
    limit?: number;
};
export type PasswordResetCode$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type PasswordResetCodeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PasswordResetCodeSelect<ExtArgs> | null;
    omit?: Prisma.PasswordResetCodeOmit<ExtArgs> | null;
    include?: Prisma.PasswordResetCodeInclude<ExtArgs> | null;
};
