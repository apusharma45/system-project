import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type LabResultModel = runtime.Types.Result.DefaultSelection<Prisma.$LabResultPayload>;
export type AggregateLabResult = {
    _count: LabResultCountAggregateOutputType | null;
    _avg: LabResultAvgAggregateOutputType | null;
    _sum: LabResultSumAggregateOutputType | null;
    _min: LabResultMinAggregateOutputType | null;
    _max: LabResultMaxAggregateOutputType | null;
};
export type LabResultAvgAggregateOutputType = {
    fileSizeBytes: number | null;
};
export type LabResultSumAggregateOutputType = {
    fileSizeBytes: number | null;
};
export type LabResultMinAggregateOutputType = {
    id: string | null;
    labOrderId: string | null;
    fileUrl: string | null;
    filePublicId: string | null;
    fileMimeType: string | null;
    fileSizeBytes: number | null;
    uploadedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LabResultMaxAggregateOutputType = {
    id: string | null;
    labOrderId: string | null;
    fileUrl: string | null;
    filePublicId: string | null;
    fileMimeType: string | null;
    fileSizeBytes: number | null;
    uploadedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LabResultCountAggregateOutputType = {
    id: number;
    labOrderId: number;
    fileUrl: number;
    filePublicId: number;
    fileMimeType: number;
    fileSizeBytes: number;
    uploadedAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type LabResultAvgAggregateInputType = {
    fileSizeBytes?: true;
};
export type LabResultSumAggregateInputType = {
    fileSizeBytes?: true;
};
export type LabResultMinAggregateInputType = {
    id?: true;
    labOrderId?: true;
    fileUrl?: true;
    filePublicId?: true;
    fileMimeType?: true;
    fileSizeBytes?: true;
    uploadedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LabResultMaxAggregateInputType = {
    id?: true;
    labOrderId?: true;
    fileUrl?: true;
    filePublicId?: true;
    fileMimeType?: true;
    fileSizeBytes?: true;
    uploadedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LabResultCountAggregateInputType = {
    id?: true;
    labOrderId?: true;
    fileUrl?: true;
    filePublicId?: true;
    fileMimeType?: true;
    fileSizeBytes?: true;
    uploadedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type LabResultAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LabResultWhereInput;
    orderBy?: Prisma.LabResultOrderByWithRelationInput | Prisma.LabResultOrderByWithRelationInput[];
    cursor?: Prisma.LabResultWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LabResultCountAggregateInputType;
    _avg?: LabResultAvgAggregateInputType;
    _sum?: LabResultSumAggregateInputType;
    _min?: LabResultMinAggregateInputType;
    _max?: LabResultMaxAggregateInputType;
};
export type GetLabResultAggregateType<T extends LabResultAggregateArgs> = {
    [P in keyof T & keyof AggregateLabResult]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLabResult[P]> : Prisma.GetScalarType<T[P], AggregateLabResult[P]>;
};
export type LabResultGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LabResultWhereInput;
    orderBy?: Prisma.LabResultOrderByWithAggregationInput | Prisma.LabResultOrderByWithAggregationInput[];
    by: Prisma.LabResultScalarFieldEnum[] | Prisma.LabResultScalarFieldEnum;
    having?: Prisma.LabResultScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LabResultCountAggregateInputType | true;
    _avg?: LabResultAvgAggregateInputType;
    _sum?: LabResultSumAggregateInputType;
    _min?: LabResultMinAggregateInputType;
    _max?: LabResultMaxAggregateInputType;
};
export type LabResultGroupByOutputType = {
    id: string;
    labOrderId: string;
    fileUrl: string;
    filePublicId: string | null;
    fileMimeType: string | null;
    fileSizeBytes: number | null;
    uploadedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    _count: LabResultCountAggregateOutputType | null;
    _avg: LabResultAvgAggregateOutputType | null;
    _sum: LabResultSumAggregateOutputType | null;
    _min: LabResultMinAggregateOutputType | null;
    _max: LabResultMaxAggregateOutputType | null;
};
type GetLabResultGroupByPayload<T extends LabResultGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LabResultGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LabResultGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LabResultGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LabResultGroupByOutputType[P]>;
}>>;
export type LabResultWhereInput = {
    AND?: Prisma.LabResultWhereInput | Prisma.LabResultWhereInput[];
    OR?: Prisma.LabResultWhereInput[];
    NOT?: Prisma.LabResultWhereInput | Prisma.LabResultWhereInput[];
    id?: Prisma.StringFilter<"LabResult"> | string;
    labOrderId?: Prisma.StringFilter<"LabResult"> | string;
    fileUrl?: Prisma.StringFilter<"LabResult"> | string;
    filePublicId?: Prisma.StringNullableFilter<"LabResult"> | string | null;
    fileMimeType?: Prisma.StringNullableFilter<"LabResult"> | string | null;
    fileSizeBytes?: Prisma.IntNullableFilter<"LabResult"> | number | null;
    uploadedAt?: Prisma.DateTimeFilter<"LabResult"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"LabResult"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LabResult"> | Date | string;
    labOrder?: Prisma.XOR<Prisma.LabOrderScalarRelationFilter, Prisma.LabOrderWhereInput>;
};
export type LabResultOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    labOrderId?: Prisma.SortOrder;
    fileUrl?: Prisma.SortOrder;
    filePublicId?: Prisma.SortOrderInput | Prisma.SortOrder;
    fileMimeType?: Prisma.SortOrderInput | Prisma.SortOrder;
    fileSizeBytes?: Prisma.SortOrderInput | Prisma.SortOrder;
    uploadedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    labOrder?: Prisma.LabOrderOrderByWithRelationInput;
};
export type LabResultWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    labOrderId?: string;
    AND?: Prisma.LabResultWhereInput | Prisma.LabResultWhereInput[];
    OR?: Prisma.LabResultWhereInput[];
    NOT?: Prisma.LabResultWhereInput | Prisma.LabResultWhereInput[];
    fileUrl?: Prisma.StringFilter<"LabResult"> | string;
    filePublicId?: Prisma.StringNullableFilter<"LabResult"> | string | null;
    fileMimeType?: Prisma.StringNullableFilter<"LabResult"> | string | null;
    fileSizeBytes?: Prisma.IntNullableFilter<"LabResult"> | number | null;
    uploadedAt?: Prisma.DateTimeFilter<"LabResult"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"LabResult"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LabResult"> | Date | string;
    labOrder?: Prisma.XOR<Prisma.LabOrderScalarRelationFilter, Prisma.LabOrderWhereInput>;
}, "id" | "labOrderId">;
export type LabResultOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    labOrderId?: Prisma.SortOrder;
    fileUrl?: Prisma.SortOrder;
    filePublicId?: Prisma.SortOrderInput | Prisma.SortOrder;
    fileMimeType?: Prisma.SortOrderInput | Prisma.SortOrder;
    fileSizeBytes?: Prisma.SortOrderInput | Prisma.SortOrder;
    uploadedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.LabResultCountOrderByAggregateInput;
    _avg?: Prisma.LabResultAvgOrderByAggregateInput;
    _max?: Prisma.LabResultMaxOrderByAggregateInput;
    _min?: Prisma.LabResultMinOrderByAggregateInput;
    _sum?: Prisma.LabResultSumOrderByAggregateInput;
};
export type LabResultScalarWhereWithAggregatesInput = {
    AND?: Prisma.LabResultScalarWhereWithAggregatesInput | Prisma.LabResultScalarWhereWithAggregatesInput[];
    OR?: Prisma.LabResultScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LabResultScalarWhereWithAggregatesInput | Prisma.LabResultScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"LabResult"> | string;
    labOrderId?: Prisma.StringWithAggregatesFilter<"LabResult"> | string;
    fileUrl?: Prisma.StringWithAggregatesFilter<"LabResult"> | string;
    filePublicId?: Prisma.StringNullableWithAggregatesFilter<"LabResult"> | string | null;
    fileMimeType?: Prisma.StringNullableWithAggregatesFilter<"LabResult"> | string | null;
    fileSizeBytes?: Prisma.IntNullableWithAggregatesFilter<"LabResult"> | number | null;
    uploadedAt?: Prisma.DateTimeWithAggregatesFilter<"LabResult"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LabResult"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"LabResult"> | Date | string;
};
export type LabResultCreateInput = {
    id?: string;
    fileUrl: string;
    filePublicId?: string | null;
    fileMimeType?: string | null;
    fileSizeBytes?: number | null;
    uploadedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    labOrder: Prisma.LabOrderCreateNestedOneWithoutLabResultInput;
};
export type LabResultUncheckedCreateInput = {
    id?: string;
    labOrderId: string;
    fileUrl: string;
    filePublicId?: string | null;
    fileMimeType?: string | null;
    fileSizeBytes?: number | null;
    uploadedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LabResultUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    filePublicId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fileMimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fileSizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    labOrder?: Prisma.LabOrderUpdateOneRequiredWithoutLabResultNestedInput;
};
export type LabResultUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    labOrderId?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    filePublicId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fileMimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fileSizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LabResultCreateManyInput = {
    id?: string;
    labOrderId: string;
    fileUrl: string;
    filePublicId?: string | null;
    fileMimeType?: string | null;
    fileSizeBytes?: number | null;
    uploadedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LabResultUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    filePublicId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fileMimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fileSizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LabResultUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    labOrderId?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    filePublicId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fileMimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fileSizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LabResultNullableScalarRelationFilter = {
    is?: Prisma.LabResultWhereInput | null;
    isNot?: Prisma.LabResultWhereInput | null;
};
export type LabResultCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    labOrderId?: Prisma.SortOrder;
    fileUrl?: Prisma.SortOrder;
    filePublicId?: Prisma.SortOrder;
    fileMimeType?: Prisma.SortOrder;
    fileSizeBytes?: Prisma.SortOrder;
    uploadedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LabResultAvgOrderByAggregateInput = {
    fileSizeBytes?: Prisma.SortOrder;
};
export type LabResultMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    labOrderId?: Prisma.SortOrder;
    fileUrl?: Prisma.SortOrder;
    filePublicId?: Prisma.SortOrder;
    fileMimeType?: Prisma.SortOrder;
    fileSizeBytes?: Prisma.SortOrder;
    uploadedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LabResultMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    labOrderId?: Prisma.SortOrder;
    fileUrl?: Prisma.SortOrder;
    filePublicId?: Prisma.SortOrder;
    fileMimeType?: Prisma.SortOrder;
    fileSizeBytes?: Prisma.SortOrder;
    uploadedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LabResultSumOrderByAggregateInput = {
    fileSizeBytes?: Prisma.SortOrder;
};
export type LabResultCreateNestedOneWithoutLabOrderInput = {
    create?: Prisma.XOR<Prisma.LabResultCreateWithoutLabOrderInput, Prisma.LabResultUncheckedCreateWithoutLabOrderInput>;
    connectOrCreate?: Prisma.LabResultCreateOrConnectWithoutLabOrderInput;
    connect?: Prisma.LabResultWhereUniqueInput;
};
export type LabResultUncheckedCreateNestedOneWithoutLabOrderInput = {
    create?: Prisma.XOR<Prisma.LabResultCreateWithoutLabOrderInput, Prisma.LabResultUncheckedCreateWithoutLabOrderInput>;
    connectOrCreate?: Prisma.LabResultCreateOrConnectWithoutLabOrderInput;
    connect?: Prisma.LabResultWhereUniqueInput;
};
export type LabResultUpdateOneWithoutLabOrderNestedInput = {
    create?: Prisma.XOR<Prisma.LabResultCreateWithoutLabOrderInput, Prisma.LabResultUncheckedCreateWithoutLabOrderInput>;
    connectOrCreate?: Prisma.LabResultCreateOrConnectWithoutLabOrderInput;
    upsert?: Prisma.LabResultUpsertWithoutLabOrderInput;
    disconnect?: Prisma.LabResultWhereInput | boolean;
    delete?: Prisma.LabResultWhereInput | boolean;
    connect?: Prisma.LabResultWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LabResultUpdateToOneWithWhereWithoutLabOrderInput, Prisma.LabResultUpdateWithoutLabOrderInput>, Prisma.LabResultUncheckedUpdateWithoutLabOrderInput>;
};
export type LabResultUncheckedUpdateOneWithoutLabOrderNestedInput = {
    create?: Prisma.XOR<Prisma.LabResultCreateWithoutLabOrderInput, Prisma.LabResultUncheckedCreateWithoutLabOrderInput>;
    connectOrCreate?: Prisma.LabResultCreateOrConnectWithoutLabOrderInput;
    upsert?: Prisma.LabResultUpsertWithoutLabOrderInput;
    disconnect?: Prisma.LabResultWhereInput | boolean;
    delete?: Prisma.LabResultWhereInput | boolean;
    connect?: Prisma.LabResultWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LabResultUpdateToOneWithWhereWithoutLabOrderInput, Prisma.LabResultUpdateWithoutLabOrderInput>, Prisma.LabResultUncheckedUpdateWithoutLabOrderInput>;
};
export type LabResultCreateWithoutLabOrderInput = {
    id?: string;
    fileUrl: string;
    filePublicId?: string | null;
    fileMimeType?: string | null;
    fileSizeBytes?: number | null;
    uploadedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LabResultUncheckedCreateWithoutLabOrderInput = {
    id?: string;
    fileUrl: string;
    filePublicId?: string | null;
    fileMimeType?: string | null;
    fileSizeBytes?: number | null;
    uploadedAt?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LabResultCreateOrConnectWithoutLabOrderInput = {
    where: Prisma.LabResultWhereUniqueInput;
    create: Prisma.XOR<Prisma.LabResultCreateWithoutLabOrderInput, Prisma.LabResultUncheckedCreateWithoutLabOrderInput>;
};
export type LabResultUpsertWithoutLabOrderInput = {
    update: Prisma.XOR<Prisma.LabResultUpdateWithoutLabOrderInput, Prisma.LabResultUncheckedUpdateWithoutLabOrderInput>;
    create: Prisma.XOR<Prisma.LabResultCreateWithoutLabOrderInput, Prisma.LabResultUncheckedCreateWithoutLabOrderInput>;
    where?: Prisma.LabResultWhereInput;
};
export type LabResultUpdateToOneWithWhereWithoutLabOrderInput = {
    where?: Prisma.LabResultWhereInput;
    data: Prisma.XOR<Prisma.LabResultUpdateWithoutLabOrderInput, Prisma.LabResultUncheckedUpdateWithoutLabOrderInput>;
};
export type LabResultUpdateWithoutLabOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    filePublicId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fileMimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fileSizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LabResultUncheckedUpdateWithoutLabOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    filePublicId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fileMimeType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    fileSizeBytes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LabResultSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    labOrderId?: boolean;
    fileUrl?: boolean;
    filePublicId?: boolean;
    fileMimeType?: boolean;
    fileSizeBytes?: boolean;
    uploadedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    labOrder?: boolean | Prisma.LabOrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["labResult"]>;
export type LabResultSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    labOrderId?: boolean;
    fileUrl?: boolean;
    filePublicId?: boolean;
    fileMimeType?: boolean;
    fileSizeBytes?: boolean;
    uploadedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    labOrder?: boolean | Prisma.LabOrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["labResult"]>;
export type LabResultSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    labOrderId?: boolean;
    fileUrl?: boolean;
    filePublicId?: boolean;
    fileMimeType?: boolean;
    fileSizeBytes?: boolean;
    uploadedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    labOrder?: boolean | Prisma.LabOrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["labResult"]>;
export type LabResultSelectScalar = {
    id?: boolean;
    labOrderId?: boolean;
    fileUrl?: boolean;
    filePublicId?: boolean;
    fileMimeType?: boolean;
    fileSizeBytes?: boolean;
    uploadedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type LabResultOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "labOrderId" | "fileUrl" | "filePublicId" | "fileMimeType" | "fileSizeBytes" | "uploadedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["labResult"]>;
export type LabResultInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    labOrder?: boolean | Prisma.LabOrderDefaultArgs<ExtArgs>;
};
export type LabResultIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    labOrder?: boolean | Prisma.LabOrderDefaultArgs<ExtArgs>;
};
export type LabResultIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    labOrder?: boolean | Prisma.LabOrderDefaultArgs<ExtArgs>;
};
export type $LabResultPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LabResult";
    objects: {
        labOrder: Prisma.$LabOrderPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        labOrderId: string;
        fileUrl: string;
        filePublicId: string | null;
        fileMimeType: string | null;
        fileSizeBytes: number | null;
        uploadedAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["labResult"]>;
    composites: {};
};
export type LabResultGetPayload<S extends boolean | null | undefined | LabResultDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LabResultPayload, S>;
export type LabResultCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LabResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LabResultCountAggregateInputType | true;
};
export interface LabResultDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LabResult'];
        meta: {
            name: 'LabResult';
        };
    };
    findUnique<T extends LabResultFindUniqueArgs>(args: Prisma.SelectSubset<T, LabResultFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LabResultClient<runtime.Types.Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LabResultFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LabResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LabResultClient<runtime.Types.Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LabResultFindFirstArgs>(args?: Prisma.SelectSubset<T, LabResultFindFirstArgs<ExtArgs>>): Prisma.Prisma__LabResultClient<runtime.Types.Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LabResultFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LabResultFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LabResultClient<runtime.Types.Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LabResultFindManyArgs>(args?: Prisma.SelectSubset<T, LabResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LabResultCreateArgs>(args: Prisma.SelectSubset<T, LabResultCreateArgs<ExtArgs>>): Prisma.Prisma__LabResultClient<runtime.Types.Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LabResultCreateManyArgs>(args?: Prisma.SelectSubset<T, LabResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LabResultCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LabResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LabResultDeleteArgs>(args: Prisma.SelectSubset<T, LabResultDeleteArgs<ExtArgs>>): Prisma.Prisma__LabResultClient<runtime.Types.Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LabResultUpdateArgs>(args: Prisma.SelectSubset<T, LabResultUpdateArgs<ExtArgs>>): Prisma.Prisma__LabResultClient<runtime.Types.Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LabResultDeleteManyArgs>(args?: Prisma.SelectSubset<T, LabResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LabResultUpdateManyArgs>(args: Prisma.SelectSubset<T, LabResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LabResultUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LabResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LabResultUpsertArgs>(args: Prisma.SelectSubset<T, LabResultUpsertArgs<ExtArgs>>): Prisma.Prisma__LabResultClient<runtime.Types.Result.GetResult<Prisma.$LabResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LabResultCountArgs>(args?: Prisma.Subset<T, LabResultCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LabResultCountAggregateOutputType> : number>;
    aggregate<T extends LabResultAggregateArgs>(args: Prisma.Subset<T, LabResultAggregateArgs>): Prisma.PrismaPromise<GetLabResultAggregateType<T>>;
    groupBy<T extends LabResultGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LabResultGroupByArgs['orderBy'];
    } : {
        orderBy?: LabResultGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LabResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLabResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LabResultFieldRefs;
}
export interface Prisma__LabResultClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    labOrder<T extends Prisma.LabOrderDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LabOrderDefaultArgs<ExtArgs>>): Prisma.Prisma__LabOrderClient<runtime.Types.Result.GetResult<Prisma.$LabOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LabResultFieldRefs {
    readonly id: Prisma.FieldRef<"LabResult", 'String'>;
    readonly labOrderId: Prisma.FieldRef<"LabResult", 'String'>;
    readonly fileUrl: Prisma.FieldRef<"LabResult", 'String'>;
    readonly filePublicId: Prisma.FieldRef<"LabResult", 'String'>;
    readonly fileMimeType: Prisma.FieldRef<"LabResult", 'String'>;
    readonly fileSizeBytes: Prisma.FieldRef<"LabResult", 'Int'>;
    readonly uploadedAt: Prisma.FieldRef<"LabResult", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"LabResult", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"LabResult", 'DateTime'>;
}
export type LabResultFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelect<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    include?: Prisma.LabResultInclude<ExtArgs> | null;
    where: Prisma.LabResultWhereUniqueInput;
};
export type LabResultFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelect<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    include?: Prisma.LabResultInclude<ExtArgs> | null;
    where: Prisma.LabResultWhereUniqueInput;
};
export type LabResultFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelect<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    include?: Prisma.LabResultInclude<ExtArgs> | null;
    where?: Prisma.LabResultWhereInput;
    orderBy?: Prisma.LabResultOrderByWithRelationInput | Prisma.LabResultOrderByWithRelationInput[];
    cursor?: Prisma.LabResultWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LabResultScalarFieldEnum | Prisma.LabResultScalarFieldEnum[];
};
export type LabResultFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelect<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    include?: Prisma.LabResultInclude<ExtArgs> | null;
    where?: Prisma.LabResultWhereInput;
    orderBy?: Prisma.LabResultOrderByWithRelationInput | Prisma.LabResultOrderByWithRelationInput[];
    cursor?: Prisma.LabResultWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LabResultScalarFieldEnum | Prisma.LabResultScalarFieldEnum[];
};
export type LabResultFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelect<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    include?: Prisma.LabResultInclude<ExtArgs> | null;
    where?: Prisma.LabResultWhereInput;
    orderBy?: Prisma.LabResultOrderByWithRelationInput | Prisma.LabResultOrderByWithRelationInput[];
    cursor?: Prisma.LabResultWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LabResultScalarFieldEnum | Prisma.LabResultScalarFieldEnum[];
};
export type LabResultCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelect<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    include?: Prisma.LabResultInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LabResultCreateInput, Prisma.LabResultUncheckedCreateInput>;
};
export type LabResultCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LabResultCreateManyInput | Prisma.LabResultCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LabResultCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    data: Prisma.LabResultCreateManyInput | Prisma.LabResultCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LabResultIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LabResultUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelect<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    include?: Prisma.LabResultInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LabResultUpdateInput, Prisma.LabResultUncheckedUpdateInput>;
    where: Prisma.LabResultWhereUniqueInput;
};
export type LabResultUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LabResultUpdateManyMutationInput, Prisma.LabResultUncheckedUpdateManyInput>;
    where?: Prisma.LabResultWhereInput;
    limit?: number;
};
export type LabResultUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LabResultUpdateManyMutationInput, Prisma.LabResultUncheckedUpdateManyInput>;
    where?: Prisma.LabResultWhereInput;
    limit?: number;
    include?: Prisma.LabResultIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LabResultUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelect<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    include?: Prisma.LabResultInclude<ExtArgs> | null;
    where: Prisma.LabResultWhereUniqueInput;
    create: Prisma.XOR<Prisma.LabResultCreateInput, Prisma.LabResultUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LabResultUpdateInput, Prisma.LabResultUncheckedUpdateInput>;
};
export type LabResultDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelect<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    include?: Prisma.LabResultInclude<ExtArgs> | null;
    where: Prisma.LabResultWhereUniqueInput;
};
export type LabResultDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LabResultWhereInput;
    limit?: number;
};
export type LabResultDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LabResultSelect<ExtArgs> | null;
    omit?: Prisma.LabResultOmit<ExtArgs> | null;
    include?: Prisma.LabResultInclude<ExtArgs> | null;
};
export {};
