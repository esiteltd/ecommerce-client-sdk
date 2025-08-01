import { z } from 'zod';

interface SDKConfig {
    baseUrl: string;
    tenant: string;
    timeout?: number;
    retries?: number;
}
interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
}
declare class BaseClient {
    private config;
    get tenant(): string;
    constructor(config: SDKConfig);
    protected unauthenticatedRequest(endpoint: string, options?: RequestOptions): Promise<Response>;
    protected request(endpoint: string, options?: RequestOptions & {
        authentication?: boolean;
    }): Promise<Response>;
    private fetchWithRetry;
    private isRetryableError;
    private delay;
}
declare class SDKError extends Error {
    statusCode?: number | undefined;
    response?: string | undefined;
    constructor(message: string, statusCode?: number | undefined, response?: string | undefined);
}

declare const phoneSchema: z.ZodString;
declare const categorySchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
}, {
    id: string;
    title: string;
}>;
declare const brandSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
}, {
    id: string;
    title: string;
}>;
declare const mediaSchema: z.ZodObject<{
    id: z.ZodString;
    content_type: z.ZodString;
    file_id: z.ZodString;
    alt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    content_type: string;
    file_id: string;
    alt: string;
}, {
    id: string;
    content_type: string;
    file_id: string;
    alt: string;
}>;
type AuthHeaders = {
    authorization: string;
};
declare const authUserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    username: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    createAt: z.ZodString;
    enabled: z.ZodBoolean;
    tenant: z.ZodString;
    tenantLanguages: z.ZodArray<z.ZodString, "many">;
    attributes: z.ZodObject<{
        permissionId: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        jobTitle: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        local: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        permissionId: string[];
        jobTitle: string[];
        local: string[];
    }, {
        permissionId?: string[] | undefined;
        jobTitle?: string[] | undefined;
        local?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    createAt: string;
    enabled: boolean;
    tenant: string;
    tenantLanguages: string[];
    attributes: {
        permissionId: string[];
        jobTitle: string[];
        local: string[];
    };
}, {
    id: string;
    name: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    createAt: string;
    enabled: boolean;
    tenant: string;
    tenantLanguages: string[];
    attributes: {
        permissionId?: string[] | undefined;
        jobTitle?: string[] | undefined;
        local?: string[] | undefined;
    };
}>;
declare const loginResponseSchema: z.ZodObject<{
    access_token: z.ZodString;
    refresh_token: z.ZodString;
    access_token_expiration: z.ZodNumber;
    refresh_token_expiration: z.ZodNumber;
    user: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        username: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodString;
        createAt: z.ZodString;
        enabled: z.ZodBoolean;
        tenant: z.ZodString;
        tenantLanguages: z.ZodArray<z.ZodString, "many">;
        attributes: z.ZodObject<{
            permissionId: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            jobTitle: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            local: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            permissionId: string[];
            jobTitle: string[];
            local: string[];
        }, {
            permissionId?: string[] | undefined;
            jobTitle?: string[] | undefined;
            local?: string[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        createAt: string;
        enabled: boolean;
        tenant: string;
        tenantLanguages: string[];
        attributes: {
            permissionId: string[];
            jobTitle: string[];
            local: string[];
        };
    }, {
        id: string;
        name: string;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        createAt: string;
        enabled: boolean;
        tenant: string;
        tenantLanguages: string[];
        attributes: {
            permissionId?: string[] | undefined;
            jobTitle?: string[] | undefined;
            local?: string[] | undefined;
        };
    }>;
    customer: z.ZodLazy<z.ZodObject<{
        id: z.ZodString;
        external_user_id: z.ZodString;
        firstname: z.ZodString;
        lastname: z.ZodString;
        language: z.ZodString;
        phonenumber: z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>;
        email: z.ZodString;
        gender: z.ZodNumber;
        date_of_birth: z.ZodNullable<z.ZodString>;
        addresses: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            country: z.ZodString;
            state: z.ZodString;
            city: z.ZodString;
            address1: z.ZodString;
            address2: z.ZodString;
            phonenumber: z.ZodString;
            is_default: z.ZodBoolean;
            postal_code: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }, {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }>, "many">>>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        email: string;
        external_user_id: string;
        firstname: string;
        lastname: string;
        language: string;
        phonenumber: string;
        gender: number;
        date_of_birth: string | null;
        addresses: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }[] | null;
    }, {
        id: string;
        email: string;
        external_user_id: string;
        firstname: string;
        lastname: string;
        language: string;
        phonenumber: string;
        gender: number;
        date_of_birth: string | null;
        addresses?: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }[] | null | undefined;
    }>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodLazy<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        country: z.ZodString;
        state: z.ZodString;
        city: z.ZodString;
        address1: z.ZodString;
        address2: z.ZodString;
        phonenumber: z.ZodString;
        is_default: z.ZodBoolean;
        postal_code: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        phonenumber: string;
        country: string;
        state: string;
        city: string;
        address1: string;
        address2: string;
        is_default: boolean;
        postal_code: string;
    }, {
        id: string;
        title: string;
        phonenumber: string;
        country: string;
        state: string;
        city: string;
        address1: string;
        address2: string;
        is_default: boolean;
        postal_code: string;
    }>>>>;
}, "strip", z.ZodTypeAny, {
    access_token: string;
    refresh_token: string;
    access_token_expiration: number;
    refresh_token_expiration: number;
    user: {
        id: string;
        name: string;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        createAt: string;
        enabled: boolean;
        tenant: string;
        tenantLanguages: string[];
        attributes: {
            permissionId: string[];
            jobTitle: string[];
            local: string[];
        };
    };
    customer: {
        id: string;
        email: string;
        external_user_id: string;
        firstname: string;
        lastname: string;
        language: string;
        phonenumber: string;
        gender: number;
        date_of_birth: string | null;
        addresses: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }[] | null;
    };
    address?: {
        id: string;
        title: string;
        phonenumber: string;
        country: string;
        state: string;
        city: string;
        address1: string;
        address2: string;
        is_default: boolean;
        postal_code: string;
    } | null | undefined;
}, {
    access_token: string;
    refresh_token: string;
    access_token_expiration: number;
    refresh_token_expiration: number;
    user: {
        id: string;
        name: string;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        createAt: string;
        enabled: boolean;
        tenant: string;
        tenantLanguages: string[];
        attributes: {
            permissionId?: string[] | undefined;
            jobTitle?: string[] | undefined;
            local?: string[] | undefined;
        };
    };
    customer: {
        id: string;
        email: string;
        external_user_id: string;
        firstname: string;
        lastname: string;
        language: string;
        phonenumber: string;
        gender: number;
        date_of_birth: string | null;
        addresses?: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }[] | null | undefined;
    };
    address?: {
        id: string;
        title: string;
        phonenumber: string;
        country: string;
        state: string;
        city: string;
        address1: string;
        address2: string;
        is_default: boolean;
        postal_code: string;
    } | null | undefined;
}>;
declare const addressFormSchema: z.ZodObject<{
    title: z.ZodString;
    country: z.ZodString;
    state: z.ZodString;
    city: z.ZodString;
    address1: z.ZodString;
    address2: z.ZodOptional<z.ZodString>;
    phonenumber: z.ZodString;
    is_default: z.ZodOptional<z.ZodBoolean>;
    postal_code: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    phonenumber: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2?: string | undefined;
    is_default?: boolean | undefined;
    postal_code?: string | undefined;
}, {
    title: string;
    phonenumber: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2?: string | undefined;
    is_default?: boolean | undefined;
    postal_code?: string | undefined;
}>;
declare const addressSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    country: z.ZodString;
    state: z.ZodString;
    city: z.ZodString;
    address1: z.ZodString;
    address2: z.ZodString;
    phonenumber: z.ZodString;
    is_default: z.ZodBoolean;
    postal_code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    phonenumber: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2: string;
    is_default: boolean;
    postal_code: string;
}, {
    id: string;
    title: string;
    phonenumber: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2: string;
    is_default: boolean;
    postal_code: string;
}>;
declare const createAddressSchema: z.ZodObject<{
    title: z.ZodString;
    country: z.ZodString;
    state: z.ZodString;
    city: z.ZodString;
    address1: z.ZodString;
    address2: z.ZodString;
    phonenumber: z.ZodString;
    is_default: z.ZodBoolean;
    postal_code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    phonenumber: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2: string;
    is_default: boolean;
    postal_code: string;
}, {
    title: string;
    phonenumber: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2: string;
    is_default: boolean;
    postal_code: string;
}>;
declare const updateAddressSchema: z.ZodObject<{
    title: z.ZodString;
    country: z.ZodString;
    state: z.ZodString;
    city: z.ZodString;
    address1: z.ZodString;
    address2: z.ZodString;
    phonenumber: z.ZodString;
    postal_code: z.ZodString;
    is_default: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    title: string;
    phonenumber: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2: string;
    is_default: boolean;
    postal_code: string;
}, {
    title: string;
    phonenumber: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2: string;
    is_default: boolean;
    postal_code: string;
}>;
declare const customerSchema: z.ZodObject<{
    id: z.ZodString;
    external_user_id: z.ZodString;
    firstname: z.ZodString;
    lastname: z.ZodString;
    language: z.ZodString;
    phonenumber: z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>;
    email: z.ZodString;
    gender: z.ZodNumber;
    date_of_birth: z.ZodNullable<z.ZodString>;
    addresses: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        country: z.ZodString;
        state: z.ZodString;
        city: z.ZodString;
        address1: z.ZodString;
        address2: z.ZodString;
        phonenumber: z.ZodString;
        is_default: z.ZodBoolean;
        postal_code: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        phonenumber: string;
        country: string;
        state: string;
        city: string;
        address1: string;
        address2: string;
        is_default: boolean;
        postal_code: string;
    }, {
        id: string;
        title: string;
        phonenumber: string;
        country: string;
        state: string;
        city: string;
        address1: string;
        address2: string;
        is_default: boolean;
        postal_code: string;
    }>, "many">>>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    external_user_id: string;
    firstname: string;
    lastname: string;
    language: string;
    phonenumber: string;
    gender: number;
    date_of_birth: string | null;
    addresses: {
        id: string;
        title: string;
        phonenumber: string;
        country: string;
        state: string;
        city: string;
        address1: string;
        address2: string;
        is_default: boolean;
        postal_code: string;
    }[] | null;
}, {
    id: string;
    email: string;
    external_user_id: string;
    firstname: string;
    lastname: string;
    language: string;
    phonenumber: string;
    gender: number;
    date_of_birth: string | null;
    addresses?: {
        id: string;
        title: string;
        phonenumber: string;
        country: string;
        state: string;
        city: string;
        address1: string;
        address2: string;
        is_default: boolean;
        postal_code: string;
    }[] | null | undefined;
}>;
declare const customerListSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        external_user_id: z.ZodString;
        firstname: z.ZodString;
        lastname: z.ZodString;
        language: z.ZodString;
        phonenumber: z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>;
        email: z.ZodString;
        gender: z.ZodNumber;
        date_of_birth: z.ZodNullable<z.ZodString>;
        addresses: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            country: z.ZodString;
            state: z.ZodString;
            city: z.ZodString;
            address1: z.ZodString;
            address2: z.ZodString;
            phonenumber: z.ZodString;
            is_default: z.ZodBoolean;
            postal_code: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }, {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }>, "many">>>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        email: string;
        external_user_id: string;
        firstname: string;
        lastname: string;
        language: string;
        phonenumber: string;
        gender: number;
        date_of_birth: string | null;
        addresses: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }[] | null;
    }, {
        id: string;
        email: string;
        external_user_id: string;
        firstname: string;
        lastname: string;
        language: string;
        phonenumber: string;
        gender: number;
        date_of_birth: string | null;
        addresses?: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }[] | null | undefined;
    }>, "many">;
    page: z.ZodNumber;
    size: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    items: {
        id: string;
        email: string;
        external_user_id: string;
        firstname: string;
        lastname: string;
        language: string;
        phonenumber: string;
        gender: number;
        date_of_birth: string | null;
        addresses: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }[] | null;
    }[];
    page: number;
    size: number;
    total: number;
}, {
    items: {
        id: string;
        email: string;
        external_user_id: string;
        firstname: string;
        lastname: string;
        language: string;
        phonenumber: string;
        gender: number;
        date_of_birth: string | null;
        addresses?: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }[] | null | undefined;
    }[];
    page: number;
    size: number;
    total: number;
}>;
declare const createCustomerSchema: z.ZodObject<{
    external_user_id: z.ZodString;
    firstname: z.ZodString;
    lastname: z.ZodString;
    language: z.ZodString;
    phonenumber: z.ZodString;
    email: z.ZodString;
    gender: z.ZodNumber;
    date_of_birth: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    external_user_id: string;
    firstname: string;
    lastname: string;
    language: string;
    phonenumber: string;
    gender: number;
    date_of_birth: string;
}, {
    email: string;
    external_user_id: string;
    firstname: string;
    lastname: string;
    language: string;
    phonenumber: string;
    gender: number;
    date_of_birth: string;
}>;
declare const updateCustomerSchema: z.ZodObject<{
    external_user_id: z.ZodString;
    firstname: z.ZodString;
    lastname: z.ZodString;
    language: z.ZodString;
    phonenumber: z.ZodString;
    email: z.ZodString;
    gender: z.ZodNumber;
    date_of_birth: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    external_user_id: string;
    firstname: string;
    lastname: string;
    language: string;
    phonenumber: string;
    gender: number;
    date_of_birth: string;
}, {
    email: string;
    external_user_id: string;
    firstname: string;
    lastname: string;
    language: string;
    phonenumber: string;
    gender: number;
    date_of_birth: string;
}>;
declare const productSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodEffects<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        index: z.ZodNumber;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        index: number;
    }, {
        title: string;
        description: string;
        index: number;
    }>, "many">, {
        title: string;
        description: string;
        index: number;
    }[], unknown>;
    short_description: z.ZodString;
    price: z.ZodNumber;
    rating: z.ZodNumber;
    sku: z.ZodString;
    slug: z.ZodString;
    currency: z.ZodEffects<z.ZodString, string, string>;
    unit: z.ZodString;
    weight: z.ZodOptional<z.ZodNumber>;
    disable: z.ZodBoolean;
    out_of_stock: z.ZodBoolean;
    attributes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        product_id: z.ZodString;
        parent_id: z.ZodNullable<z.ZodString>;
        media_id: z.ZodNullable<z.ZodString>;
        type: z.ZodString;
        extra: z.ZodString;
        children: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            product_id: z.ZodString;
            parent_id: z.ZodString;
            media_id: z.ZodNullable<z.ZodString>;
            type: z.ZodString;
            extra: z.ZodString;
            price: z.ZodNumber;
            sku: z.ZodString;
            children: z.ZodArray<z.ZodUnknown, "many">;
        }, "strip", z.ZodTypeAny, {
            id: string;
            type: string;
            price: number;
            sku: string;
            product_id: string;
            parent_id: string;
            media_id: string | null;
            extra: string;
            children: unknown[];
        }, {
            id: string;
            type: string;
            price: number;
            sku: string;
            product_id: string;
            parent_id: string;
            media_id: string | null;
            extra: string;
            children: unknown[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        type: string;
        product_id: string;
        parent_id: string | null;
        media_id: string | null;
        extra: string;
        children: {
            id: string;
            type: string;
            price: number;
            sku: string;
            product_id: string;
            parent_id: string;
            media_id: string | null;
            extra: string;
            children: unknown[];
        }[];
    }, {
        id: string;
        type: string;
        product_id: string;
        parent_id: string | null;
        media_id: string | null;
        extra: string;
        children: {
            id: string;
            type: string;
            price: number;
            sku: string;
            product_id: string;
            parent_id: string;
            media_id: string | null;
            extra: string;
            children: unknown[];
        }[];
    }>, "many">;
    media: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        content_type: z.ZodString;
        file_id: z.ZodString;
        alt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        content_type: string;
        file_id: string;
        alt: string;
    }, {
        id: string;
        content_type: string;
        file_id: string;
        alt: string;
    }>, "many">>>>;
    categories: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
    }, {
        id: string;
        title: string;
    }>, "many">>>>;
    brands: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
    }, {
        id: string;
        title: string;
    }>, "many">>>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    attributes: {
        id: string;
        type: string;
        product_id: string;
        parent_id: string | null;
        media_id: string | null;
        extra: string;
        children: {
            id: string;
            type: string;
            price: number;
            sku: string;
            product_id: string;
            parent_id: string;
            media_id: string | null;
            extra: string;
            children: unknown[];
        }[];
    }[];
    description: {
        title: string;
        description: string;
        index: number;
    }[];
    short_description: string;
    price: number;
    rating: number;
    sku: string;
    slug: string;
    currency: string;
    unit: string;
    disable: boolean;
    out_of_stock: boolean;
    media: {
        id: string;
        content_type: string;
        file_id: string;
        alt: string;
    }[] | null;
    categories: {
        id: string;
        title: string;
    }[] | null;
    brands: {
        id: string;
        title: string;
    }[] | null;
    weight?: number | undefined;
}, {
    id: string;
    title: string;
    attributes: {
        id: string;
        type: string;
        product_id: string;
        parent_id: string | null;
        media_id: string | null;
        extra: string;
        children: {
            id: string;
            type: string;
            price: number;
            sku: string;
            product_id: string;
            parent_id: string;
            media_id: string | null;
            extra: string;
            children: unknown[];
        }[];
    }[];
    short_description: string;
    price: number;
    rating: number;
    sku: string;
    slug: string;
    currency: string;
    unit: string;
    disable: boolean;
    out_of_stock: boolean;
    description?: unknown;
    weight?: number | undefined;
    media?: {
        id: string;
        content_type: string;
        file_id: string;
        alt: string;
    }[] | null | undefined;
    categories?: {
        id: string;
        title: string;
    }[] | null | undefined;
    brands?: {
        id: string;
        title: string;
    }[] | null | undefined;
}>;
declare const productListItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    price: z.ZodNumber;
    sku: z.ZodString;
    slug: z.ZodNullable<z.ZodString>;
    currency: z.ZodEffects<z.ZodString, string, string>;
    unit: z.ZodString;
    weight: z.ZodOptional<z.ZodNumber>;
    out_of_stock: z.ZodBoolean;
    media_id: z.ZodNullable<z.ZodString>;
    media_content_type: z.ZodNullable<z.ZodString>;
    media_file_id: z.ZodNullable<z.ZodString>;
    category_id: z.ZodNullable<z.ZodString>;
    category_title: z.ZodNullable<z.ZodString>;
    brand_id: z.ZodNullable<z.ZodString>;
    brand_title: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    price: number;
    sku: string;
    slug: string | null;
    currency: string;
    unit: string;
    out_of_stock: boolean;
    media_id: string | null;
    media_content_type: string | null;
    media_file_id: string | null;
    category_id: string | null;
    category_title: string | null;
    brand_id: string | null;
    brand_title: string | null;
    weight?: number | undefined;
}, {
    id: string;
    title: string;
    price: number;
    sku: string;
    slug: string | null;
    currency: string;
    unit: string;
    out_of_stock: boolean;
    media_id: string | null;
    media_content_type: string | null;
    media_file_id: string | null;
    category_id: string | null;
    category_title: string | null;
    brand_id: string | null;
    brand_title: string | null;
    weight?: number | undefined;
}>;
declare const productListSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        price: z.ZodNumber;
        sku: z.ZodString;
        slug: z.ZodNullable<z.ZodString>;
        currency: z.ZodEffects<z.ZodString, string, string>;
        unit: z.ZodString;
        weight: z.ZodOptional<z.ZodNumber>;
        out_of_stock: z.ZodBoolean;
        media_id: z.ZodNullable<z.ZodString>;
        media_content_type: z.ZodNullable<z.ZodString>;
        media_file_id: z.ZodNullable<z.ZodString>;
        category_id: z.ZodNullable<z.ZodString>;
        category_title: z.ZodNullable<z.ZodString>;
        brand_id: z.ZodNullable<z.ZodString>;
        brand_title: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        price: number;
        sku: string;
        slug: string | null;
        currency: string;
        unit: string;
        out_of_stock: boolean;
        media_id: string | null;
        media_content_type: string | null;
        media_file_id: string | null;
        category_id: string | null;
        category_title: string | null;
        brand_id: string | null;
        brand_title: string | null;
        weight?: number | undefined;
    }, {
        id: string;
        title: string;
        price: number;
        sku: string;
        slug: string | null;
        currency: string;
        unit: string;
        out_of_stock: boolean;
        media_id: string | null;
        media_content_type: string | null;
        media_file_id: string | null;
        category_id: string | null;
        category_title: string | null;
        brand_id: string | null;
        brand_title: string | null;
        weight?: number | undefined;
    }>, "many">;
    page: z.ZodNumber;
    size: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    items: {
        id: string;
        title: string;
        price: number;
        sku: string;
        slug: string | null;
        currency: string;
        unit: string;
        out_of_stock: boolean;
        media_id: string | null;
        media_content_type: string | null;
        media_file_id: string | null;
        category_id: string | null;
        category_title: string | null;
        brand_id: string | null;
        brand_title: string | null;
        weight?: number | undefined;
    }[];
    page: number;
    size: number;
    total: number;
}, {
    items: {
        id: string;
        title: string;
        price: number;
        sku: string;
        slug: string | null;
        currency: string;
        unit: string;
        out_of_stock: boolean;
        media_id: string | null;
        media_content_type: string | null;
        media_file_id: string | null;
        category_id: string | null;
        category_title: string | null;
        brand_id: string | null;
        brand_title: string | null;
        weight?: number | undefined;
    }[];
    page: number;
    size: number;
    total: number;
}>;
declare const categoryListItemSchema: z.ZodObject<{
    id: z.ZodString;
    parent_id: z.ZodNullable<z.ZodString>;
    media_id: z.ZodNullable<z.ZodString>;
    title: z.ZodString;
    products: z.ZodNumber;
    children: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        parent_id: z.ZodString;
        media_id: z.ZodNullable<z.ZodString>;
        title: z.ZodString;
        children: z.ZodArray<z.ZodUnknown, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        parent_id: string;
        media_id: string | null;
        children: unknown[];
    }, {
        id: string;
        title: string;
        parent_id: string;
        media_id: string | null;
        children: unknown[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    parent_id: string | null;
    media_id: string | null;
    children: {
        id: string;
        title: string;
        parent_id: string;
        media_id: string | null;
        children: unknown[];
    }[];
    products: number;
}, {
    id: string;
    title: string;
    parent_id: string | null;
    media_id: string | null;
    children: {
        id: string;
        title: string;
        parent_id: string;
        media_id: string | null;
        children: unknown[];
    }[];
    products: number;
}>;
declare const categoryListSchema: z.ZodObject<{
    items: z.ZodDefault<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        parent_id: z.ZodNullable<z.ZodString>;
        media_id: z.ZodNullable<z.ZodString>;
        title: z.ZodString;
        products: z.ZodNumber;
        children: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            parent_id: z.ZodString;
            media_id: z.ZodNullable<z.ZodString>;
            title: z.ZodString;
            children: z.ZodArray<z.ZodUnknown, "many">;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            parent_id: string;
            media_id: string | null;
            children: unknown[];
        }, {
            id: string;
            title: string;
            parent_id: string;
            media_id: string | null;
            children: unknown[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        parent_id: string | null;
        media_id: string | null;
        children: {
            id: string;
            title: string;
            parent_id: string;
            media_id: string | null;
            children: unknown[];
        }[];
        products: number;
    }, {
        id: string;
        title: string;
        parent_id: string | null;
        media_id: string | null;
        children: {
            id: string;
            title: string;
            parent_id: string;
            media_id: string | null;
            children: unknown[];
        }[];
        products: number;
    }>, "many">>>;
    page: z.ZodNumber;
    size: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    items: {
        id: string;
        title: string;
        parent_id: string | null;
        media_id: string | null;
        children: {
            id: string;
            title: string;
            parent_id: string;
            media_id: string | null;
            children: unknown[];
        }[];
        products: number;
    }[] | null;
    page: number;
    size: number;
    total: number;
}, {
    page: number;
    size: number;
    total: number;
    items?: {
        id: string;
        title: string;
        parent_id: string | null;
        media_id: string | null;
        children: {
            id: string;
            title: string;
            parent_id: string;
            media_id: string | null;
            children: unknown[];
        }[];
        products: number;
    }[] | null | undefined;
}>;
declare const cartListSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        product_id: z.ZodString;
        product_attribute_id: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
        device_token: z.ZodString;
        notes: z.ZodString;
        created_at: z.ZodString;
        total_price: z.ZodNumber;
        product: z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodString;
            short_description: z.ZodString;
            price: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            sku: z.ZodString;
            slug: z.ZodString;
            currency: z.ZodString;
            unit: z.ZodString;
            disable: z.ZodBoolean;
            out_of_stock: z.ZodBoolean;
            reviews_count: z.ZodNumber;
            rating: z.ZodNumber;
            attributes: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                product_id: z.ZodString;
                parent_id: z.ZodNullable<z.ZodString>;
                media_id: z.ZodNullable<z.ZodString>;
                type: z.ZodString;
                extra: z.ZodString;
                price: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                children: z.ZodArray<z.ZodUnknown, "many">;
            }, "strip", z.ZodTypeAny, {
                id: string;
                type: string;
                product_id: string;
                parent_id: string | null;
                media_id: string | null;
                extra: string;
                children: unknown[];
                price?: number | null | undefined;
            }, {
                id: string;
                type: string;
                product_id: string;
                parent_id: string | null;
                media_id: string | null;
                extra: string;
                children: unknown[];
                price?: number | null | undefined;
            }>, "many">;
            media: z.ZodDefault<z.ZodNullable<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                content_type: z.ZodString;
                file_id: z.ZodString;
                alt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
                content_type: string;
                file_id: string;
                alt: string;
            }, {
                id: string;
                content_type: string;
                file_id: string;
                alt: string;
            }>, "many">>>;
            categories: z.ZodDefault<z.ZodNullable<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
                title: string;
            }, {
                id: string;
                title: string;
            }>, "many">>>;
            brands: z.ZodDefault<z.ZodNullable<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
                title: string;
            }, {
                id: string;
                title: string;
            }>, "many">>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            attributes: {
                id: string;
                type: string;
                product_id: string;
                parent_id: string | null;
                media_id: string | null;
                extra: string;
                children: unknown[];
                price?: number | null | undefined;
            }[];
            description: string;
            short_description: string;
            rating: number;
            sku: string;
            slug: string;
            currency: string;
            unit: string;
            disable: boolean;
            out_of_stock: boolean;
            media: {
                id: string;
                content_type: string;
                file_id: string;
                alt: string;
            }[] | null;
            categories: {
                id: string;
                title: string;
            }[] | null;
            brands: {
                id: string;
                title: string;
            }[] | null;
            reviews_count: number;
            price?: number | null | undefined;
        }, {
            id: string;
            title: string;
            attributes: {
                id: string;
                type: string;
                product_id: string;
                parent_id: string | null;
                media_id: string | null;
                extra: string;
                children: unknown[];
                price?: number | null | undefined;
            }[];
            description: string;
            short_description: string;
            rating: number;
            sku: string;
            slug: string;
            currency: string;
            unit: string;
            disable: boolean;
            out_of_stock: boolean;
            reviews_count: number;
            price?: number | null | undefined;
            media?: {
                id: string;
                content_type: string;
                file_id: string;
                alt: string;
            }[] | null | undefined;
            categories?: {
                id: string;
                title: string;
            }[] | null | undefined;
            brands?: {
                id: string;
                title: string;
            }[] | null | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        product_id: string;
        quantity: number;
        device_token: string;
        notes: string;
        created_at: string;
        total_price: number;
        product: {
            id: string;
            title: string;
            attributes: {
                id: string;
                type: string;
                product_id: string;
                parent_id: string | null;
                media_id: string | null;
                extra: string;
                children: unknown[];
                price?: number | null | undefined;
            }[];
            description: string;
            short_description: string;
            rating: number;
            sku: string;
            slug: string;
            currency: string;
            unit: string;
            disable: boolean;
            out_of_stock: boolean;
            media: {
                id: string;
                content_type: string;
                file_id: string;
                alt: string;
            }[] | null;
            categories: {
                id: string;
                title: string;
            }[] | null;
            brands: {
                id: string;
                title: string;
            }[] | null;
            reviews_count: number;
            price?: number | null | undefined;
        };
        product_attribute_id?: string | undefined;
    }, {
        id: string;
        product_id: string;
        quantity: number;
        device_token: string;
        notes: string;
        created_at: string;
        total_price: number;
        product: {
            id: string;
            title: string;
            attributes: {
                id: string;
                type: string;
                product_id: string;
                parent_id: string | null;
                media_id: string | null;
                extra: string;
                children: unknown[];
                price?: number | null | undefined;
            }[];
            description: string;
            short_description: string;
            rating: number;
            sku: string;
            slug: string;
            currency: string;
            unit: string;
            disable: boolean;
            out_of_stock: boolean;
            reviews_count: number;
            price?: number | null | undefined;
            media?: {
                id: string;
                content_type: string;
                file_id: string;
                alt: string;
            }[] | null | undefined;
            categories?: {
                id: string;
                title: string;
            }[] | null | undefined;
            brands?: {
                id: string;
                title: string;
            }[] | null | undefined;
        };
        product_attribute_id?: string | undefined;
    }>, "many">;
    total_price: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    items: {
        id: string;
        product_id: string;
        quantity: number;
        device_token: string;
        notes: string;
        created_at: string;
        total_price: number;
        product: {
            id: string;
            title: string;
            attributes: {
                id: string;
                type: string;
                product_id: string;
                parent_id: string | null;
                media_id: string | null;
                extra: string;
                children: unknown[];
                price?: number | null | undefined;
            }[];
            description: string;
            short_description: string;
            rating: number;
            sku: string;
            slug: string;
            currency: string;
            unit: string;
            disable: boolean;
            out_of_stock: boolean;
            media: {
                id: string;
                content_type: string;
                file_id: string;
                alt: string;
            }[] | null;
            categories: {
                id: string;
                title: string;
            }[] | null;
            brands: {
                id: string;
                title: string;
            }[] | null;
            reviews_count: number;
            price?: number | null | undefined;
        };
        product_attribute_id?: string | undefined;
    }[];
    total_price: number;
}, {
    items: {
        id: string;
        product_id: string;
        quantity: number;
        device_token: string;
        notes: string;
        created_at: string;
        total_price: number;
        product: {
            id: string;
            title: string;
            attributes: {
                id: string;
                type: string;
                product_id: string;
                parent_id: string | null;
                media_id: string | null;
                extra: string;
                children: unknown[];
                price?: number | null | undefined;
            }[];
            description: string;
            short_description: string;
            rating: number;
            sku: string;
            slug: string;
            currency: string;
            unit: string;
            disable: boolean;
            out_of_stock: boolean;
            reviews_count: number;
            price?: number | null | undefined;
            media?: {
                id: string;
                content_type: string;
                file_id: string;
                alt: string;
            }[] | null | undefined;
            categories?: {
                id: string;
                title: string;
            }[] | null | undefined;
            brands?: {
                id: string;
                title: string;
            }[] | null | undefined;
        };
        product_attribute_id?: string | undefined;
    }[];
    total_price?: number | undefined;
}>;
declare const upsertCartSchema: z.ZodObject<{
    product_id: z.ZodString;
    customer_id: z.ZodOptional<z.ZodString>;
    product_attribute_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    quantity: z.ZodNumber;
    notes: z.ZodString;
}, "strip", z.ZodTypeAny, {
    product_id: string;
    quantity: number;
    notes: string;
    product_attribute_id?: string | null | undefined;
    customer_id?: string | undefined;
}, {
    product_id: string;
    quantity: number;
    notes: string;
    product_attribute_id?: string | null | undefined;
    customer_id?: string | undefined;
}>;
declare const orderItemSchema: z.ZodObject<{
    id: z.ZodString;
    order_id: z.ZodString;
    cart_id: z.ZodString;
    product_id: z.ZodString;
    product_attribute_id: z.ZodNullable<z.ZodString>;
    price: z.ZodNumber;
    price_updated_at: z.ZodString;
    quantity: z.ZodNumber;
    notes: z.ZodString;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    price: number;
    product_id: string;
    product_attribute_id: string | null;
    quantity: number;
    notes: string;
    created_at: string;
    order_id: string;
    cart_id: string;
    price_updated_at: string;
}, {
    id: string;
    price: number;
    product_id: string;
    product_attribute_id: string | null;
    quantity: number;
    notes: string;
    created_at: string;
    order_id: string;
    cart_id: string;
    price_updated_at: string;
}>;
declare const getOrderItemSchema: z.ZodObject<{
    id: z.ZodString;
    order_id: z.ZodString;
    cart_id: z.ZodString;
    product_id: z.ZodString;
    product_attribute_id: z.ZodNullable<z.ZodString>;
    price: z.ZodNumber;
    price_updated_at: z.ZodString;
    quantity: z.ZodNumber;
    notes: z.ZodString;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    price: number;
    product_id: string;
    product_attribute_id: string | null;
    quantity: number;
    notes: string;
    created_at: string;
    order_id: string;
    cart_id: string;
    price_updated_at: string;
}, {
    id: string;
    price: number;
    product_id: string;
    product_attribute_id: string | null;
    quantity: number;
    notes: string;
    created_at: string;
    order_id: string;
    cart_id: string;
    price_updated_at: string;
}>;
declare const orderPaymentSchema: z.ZodObject<{
    id: z.ZodString;
    order_id: z.ZodString;
    status: z.ZodNumber;
    provider: z.ZodString;
    amount: z.ZodNumber;
    created_at: z.ZodString;
    provider_extra_information: z.ZodObject<{
        id: z.ZodString;
        payment_id: z.ZodString;
        url: z.ZodString;
        payment_status: z.ZodString;
        session_status: z.ZodString;
        session_expires_at: z.ZodNumber;
        session_created_at: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        payment_id: string;
        url: string;
        payment_status: string;
        session_status: string;
        session_expires_at: number;
        session_created_at: number;
    }, {
        id: string;
        payment_id: string;
        url: string;
        payment_status: string;
        session_status: string;
        session_expires_at: number;
        session_created_at: number;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: number;
    created_at: string;
    order_id: string;
    provider: string;
    amount: number;
    provider_extra_information: {
        id: string;
        payment_id: string;
        url: string;
        payment_status: string;
        session_status: string;
        session_expires_at: number;
        session_created_at: number;
    };
}, {
    id: string;
    status: number;
    created_at: string;
    order_id: string;
    provider: string;
    amount: number;
    provider_extra_information: {
        id: string;
        payment_id: string;
        url: string;
        payment_status: string;
        session_status: string;
        session_expires_at: number;
        session_created_at: number;
    };
}>;
declare const orderSchema: z.ZodObject<{
    order: z.ZodObject<{
        id: z.ZodString;
        customer_id: z.ZodString;
        address_id: z.ZodString;
        currency: z.ZodString;
        total_price: z.ZodNumber;
        total_paid: z.ZodNumber;
        created_at: z.ZodString;
        payment_id: z.ZodString;
        payment_provider: z.ZodString;
        payment_status: z.ZodString;
        payment_created_at: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            order_id: z.ZodString;
            cart_id: z.ZodString;
            product_id: z.ZodString;
            product_attribute_id: z.ZodNullable<z.ZodString>;
            price: z.ZodNumber;
            price_updated_at: z.ZodString;
            quantity: z.ZodNumber;
            notes: z.ZodString;
            created_at: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
        }, {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        items: {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
        }[];
        currency: string;
        created_at: string;
        total_price: number;
        customer_id: string;
        payment_id: string;
        payment_status: string;
        address_id: string;
        total_paid: number;
        payment_provider: string;
        payment_created_at: string;
    }, {
        id: string;
        items: {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
        }[];
        currency: string;
        created_at: string;
        total_price: number;
        customer_id: string;
        payment_id: string;
        payment_status: string;
        address_id: string;
        total_paid: number;
        payment_provider: string;
        payment_created_at: string;
    }>;
    payment: z.ZodObject<{
        id: z.ZodString;
        order_id: z.ZodString;
        status: z.ZodNumber;
        provider: z.ZodString;
        amount: z.ZodNumber;
        created_at: z.ZodString;
        provider_extra_information: z.ZodObject<{
            id: z.ZodString;
            payment_id: z.ZodString;
            url: z.ZodString;
            payment_status: z.ZodString;
            session_status: z.ZodString;
            session_expires_at: z.ZodNumber;
            session_created_at: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: string;
            payment_id: string;
            url: string;
            payment_status: string;
            session_status: string;
            session_expires_at: number;
            session_created_at: number;
        }, {
            id: string;
            payment_id: string;
            url: string;
            payment_status: string;
            session_status: string;
            session_expires_at: number;
            session_created_at: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        status: number;
        created_at: string;
        order_id: string;
        provider: string;
        amount: number;
        provider_extra_information: {
            id: string;
            payment_id: string;
            url: string;
            payment_status: string;
            session_status: string;
            session_expires_at: number;
            session_created_at: number;
        };
    }, {
        id: string;
        status: number;
        created_at: string;
        order_id: string;
        provider: string;
        amount: number;
        provider_extra_information: {
            id: string;
            payment_id: string;
            url: string;
            payment_status: string;
            session_status: string;
            session_expires_at: number;
            session_created_at: number;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    order: {
        id: string;
        items: {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
        }[];
        currency: string;
        created_at: string;
        total_price: number;
        customer_id: string;
        payment_id: string;
        payment_status: string;
        address_id: string;
        total_paid: number;
        payment_provider: string;
        payment_created_at: string;
    };
    payment: {
        id: string;
        status: number;
        created_at: string;
        order_id: string;
        provider: string;
        amount: number;
        provider_extra_information: {
            id: string;
            payment_id: string;
            url: string;
            payment_status: string;
            session_status: string;
            session_expires_at: number;
            session_created_at: number;
        };
    };
}, {
    order: {
        id: string;
        items: {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
        }[];
        currency: string;
        created_at: string;
        total_price: number;
        customer_id: string;
        payment_id: string;
        payment_status: string;
        address_id: string;
        total_paid: number;
        payment_provider: string;
        payment_created_at: string;
    };
    payment: {
        id: string;
        status: number;
        created_at: string;
        order_id: string;
        provider: string;
        amount: number;
        provider_extra_information: {
            id: string;
            payment_id: string;
            url: string;
            payment_status: string;
            session_status: string;
            session_expires_at: number;
            session_created_at: number;
        };
    };
}>;
declare const orderListSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        number: z.ZodString;
        customer_id: z.ZodString;
        currency: z.ZodString;
        total_price: z.ZodNumber;
        total_paid: z.ZodNumber;
        created_at: z.ZodString;
        payment_id: z.ZodString;
        payment_provider: z.ZodString;
        payment_status: z.ZodString;
        payment_created_at: z.ZodString;
        items_count: z.ZodOptional<z.ZodNumber>;
        current_step: z.ZodObject<{
            id: z.ZodString;
            order_id: z.ZodString;
            kind: z.ZodString;
            extra: z.ZodString;
            created_at: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            extra: string;
            created_at: string;
            order_id: string;
            kind: string;
        }, {
            id: string;
            extra: string;
            created_at: string;
            order_id: string;
            kind: string;
        }>;
        items: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            order_id: z.ZodString;
            cart_id: z.ZodString;
            product_id: z.ZodString;
            product_attribute_id: z.ZodNullable<z.ZodString>;
            price: z.ZodNumber;
            price_updated_at: z.ZodString;
            quantity: z.ZodNumber;
            notes: z.ZodString;
            created_at: z.ZodString;
            product: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                description: z.ZodEffects<z.ZodArray<z.ZodObject<{
                    title: z.ZodString;
                    index: z.ZodNumber;
                    description: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    title: string;
                    description: string;
                    index: number;
                }, {
                    title: string;
                    description: string;
                    index: number;
                }>, "many">, {
                    title: string;
                    description: string;
                    index: number;
                }[], unknown>;
                short_description: z.ZodString;
                price: z.ZodNumber;
                rating: z.ZodNumber;
                sku: z.ZodString;
                slug: z.ZodString;
                currency: z.ZodEffects<z.ZodString, string, string>;
                unit: z.ZodString;
                weight: z.ZodOptional<z.ZodNumber>;
                disable: z.ZodBoolean;
                out_of_stock: z.ZodBoolean;
                attributes: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    product_id: z.ZodString;
                    parent_id: z.ZodNullable<z.ZodString>;
                    media_id: z.ZodNullable<z.ZodString>;
                    type: z.ZodString;
                    extra: z.ZodString;
                    children: z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        product_id: z.ZodString;
                        parent_id: z.ZodString;
                        media_id: z.ZodNullable<z.ZodString>;
                        type: z.ZodString;
                        extra: z.ZodString;
                        price: z.ZodNumber;
                        sku: z.ZodString;
                        children: z.ZodArray<z.ZodUnknown, "many">;
                    }, "strip", z.ZodTypeAny, {
                        id: string;
                        type: string;
                        price: number;
                        sku: string;
                        product_id: string;
                        parent_id: string;
                        media_id: string | null;
                        extra: string;
                        children: unknown[];
                    }, {
                        id: string;
                        type: string;
                        price: number;
                        sku: string;
                        product_id: string;
                        parent_id: string;
                        media_id: string | null;
                        extra: string;
                        children: unknown[];
                    }>, "many">;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                    type: string;
                    product_id: string;
                    parent_id: string | null;
                    media_id: string | null;
                    extra: string;
                    children: {
                        id: string;
                        type: string;
                        price: number;
                        sku: string;
                        product_id: string;
                        parent_id: string;
                        media_id: string | null;
                        extra: string;
                        children: unknown[];
                    }[];
                }, {
                    id: string;
                    type: string;
                    product_id: string;
                    parent_id: string | null;
                    media_id: string | null;
                    extra: string;
                    children: {
                        id: string;
                        type: string;
                        price: number;
                        sku: string;
                        product_id: string;
                        parent_id: string;
                        media_id: string | null;
                        extra: string;
                        children: unknown[];
                    }[];
                }>, "many">;
                media: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    content_type: z.ZodString;
                    file_id: z.ZodString;
                    alt: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                    content_type: string;
                    file_id: string;
                    alt: string;
                }, {
                    id: string;
                    content_type: string;
                    file_id: string;
                    alt: string;
                }>, "many">>>>;
                categories: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    title: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                    title: string;
                }, {
                    id: string;
                    title: string;
                }>, "many">>>>;
                brands: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    title: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                    title: string;
                }, {
                    id: string;
                    title: string;
                }>, "many">>>>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                title: string;
                attributes: {
                    id: string;
                    type: string;
                    product_id: string;
                    parent_id: string | null;
                    media_id: string | null;
                    extra: string;
                    children: {
                        id: string;
                        type: string;
                        price: number;
                        sku: string;
                        product_id: string;
                        parent_id: string;
                        media_id: string | null;
                        extra: string;
                        children: unknown[];
                    }[];
                }[];
                description: {
                    title: string;
                    description: string;
                    index: number;
                }[];
                short_description: string;
                price: number;
                rating: number;
                sku: string;
                slug: string;
                currency: string;
                unit: string;
                disable: boolean;
                out_of_stock: boolean;
                media: {
                    id: string;
                    content_type: string;
                    file_id: string;
                    alt: string;
                }[] | null;
                categories: {
                    id: string;
                    title: string;
                }[] | null;
                brands: {
                    id: string;
                    title: string;
                }[] | null;
                weight?: number | undefined;
            }, {
                id: string;
                title: string;
                attributes: {
                    id: string;
                    type: string;
                    product_id: string;
                    parent_id: string | null;
                    media_id: string | null;
                    extra: string;
                    children: {
                        id: string;
                        type: string;
                        price: number;
                        sku: string;
                        product_id: string;
                        parent_id: string;
                        media_id: string | null;
                        extra: string;
                        children: unknown[];
                    }[];
                }[];
                short_description: string;
                price: number;
                rating: number;
                sku: string;
                slug: string;
                currency: string;
                unit: string;
                disable: boolean;
                out_of_stock: boolean;
                description?: unknown;
                weight?: number | undefined;
                media?: {
                    id: string;
                    content_type: string;
                    file_id: string;
                    alt: string;
                }[] | null | undefined;
                categories?: {
                    id: string;
                    title: string;
                }[] | null | undefined;
                brands?: {
                    id: string;
                    title: string;
                }[] | null | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
            product?: {
                id: string;
                title: string;
                attributes: {
                    id: string;
                    type: string;
                    product_id: string;
                    parent_id: string | null;
                    media_id: string | null;
                    extra: string;
                    children: {
                        id: string;
                        type: string;
                        price: number;
                        sku: string;
                        product_id: string;
                        parent_id: string;
                        media_id: string | null;
                        extra: string;
                        children: unknown[];
                    }[];
                }[];
                description: {
                    title: string;
                    description: string;
                    index: number;
                }[];
                short_description: string;
                price: number;
                rating: number;
                sku: string;
                slug: string;
                currency: string;
                unit: string;
                disable: boolean;
                out_of_stock: boolean;
                media: {
                    id: string;
                    content_type: string;
                    file_id: string;
                    alt: string;
                }[] | null;
                categories: {
                    id: string;
                    title: string;
                }[] | null;
                brands: {
                    id: string;
                    title: string;
                }[] | null;
                weight?: number | undefined;
            } | undefined;
        }, {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
            product?: {
                id: string;
                title: string;
                attributes: {
                    id: string;
                    type: string;
                    product_id: string;
                    parent_id: string | null;
                    media_id: string | null;
                    extra: string;
                    children: {
                        id: string;
                        type: string;
                        price: number;
                        sku: string;
                        product_id: string;
                        parent_id: string;
                        media_id: string | null;
                        extra: string;
                        children: unknown[];
                    }[];
                }[];
                short_description: string;
                price: number;
                rating: number;
                sku: string;
                slug: string;
                currency: string;
                unit: string;
                disable: boolean;
                out_of_stock: boolean;
                description?: unknown;
                weight?: number | undefined;
                media?: {
                    id: string;
                    content_type: string;
                    file_id: string;
                    alt: string;
                }[] | null | undefined;
                categories?: {
                    id: string;
                    title: string;
                }[] | null | undefined;
                brands?: {
                    id: string;
                    title: string;
                }[] | null | undefined;
            } | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        number: string;
        id: string;
        currency: string;
        created_at: string;
        total_price: number;
        customer_id: string;
        payment_id: string;
        payment_status: string;
        total_paid: number;
        payment_provider: string;
        payment_created_at: string;
        current_step: {
            id: string;
            extra: string;
            created_at: string;
            order_id: string;
            kind: string;
        };
        items?: {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
            product?: {
                id: string;
                title: string;
                attributes: {
                    id: string;
                    type: string;
                    product_id: string;
                    parent_id: string | null;
                    media_id: string | null;
                    extra: string;
                    children: {
                        id: string;
                        type: string;
                        price: number;
                        sku: string;
                        product_id: string;
                        parent_id: string;
                        media_id: string | null;
                        extra: string;
                        children: unknown[];
                    }[];
                }[];
                description: {
                    title: string;
                    description: string;
                    index: number;
                }[];
                short_description: string;
                price: number;
                rating: number;
                sku: string;
                slug: string;
                currency: string;
                unit: string;
                disable: boolean;
                out_of_stock: boolean;
                media: {
                    id: string;
                    content_type: string;
                    file_id: string;
                    alt: string;
                }[] | null;
                categories: {
                    id: string;
                    title: string;
                }[] | null;
                brands: {
                    id: string;
                    title: string;
                }[] | null;
                weight?: number | undefined;
            } | undefined;
        }[] | undefined;
        items_count?: number | undefined;
    }, {
        number: string;
        id: string;
        currency: string;
        created_at: string;
        total_price: number;
        customer_id: string;
        payment_id: string;
        payment_status: string;
        total_paid: number;
        payment_provider: string;
        payment_created_at: string;
        current_step: {
            id: string;
            extra: string;
            created_at: string;
            order_id: string;
            kind: string;
        };
        items?: {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
            product?: {
                id: string;
                title: string;
                attributes: {
                    id: string;
                    type: string;
                    product_id: string;
                    parent_id: string | null;
                    media_id: string | null;
                    extra: string;
                    children: {
                        id: string;
                        type: string;
                        price: number;
                        sku: string;
                        product_id: string;
                        parent_id: string;
                        media_id: string | null;
                        extra: string;
                        children: unknown[];
                    }[];
                }[];
                short_description: string;
                price: number;
                rating: number;
                sku: string;
                slug: string;
                currency: string;
                unit: string;
                disable: boolean;
                out_of_stock: boolean;
                description?: unknown;
                weight?: number | undefined;
                media?: {
                    id: string;
                    content_type: string;
                    file_id: string;
                    alt: string;
                }[] | null | undefined;
                categories?: {
                    id: string;
                    title: string;
                }[] | null | undefined;
                brands?: {
                    id: string;
                    title: string;
                }[] | null | undefined;
            } | undefined;
        }[] | undefined;
        items_count?: number | undefined;
    }>, "many">;
    page: z.ZodNumber;
    size: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    items: {
        number: string;
        id: string;
        currency: string;
        created_at: string;
        total_price: number;
        customer_id: string;
        payment_id: string;
        payment_status: string;
        total_paid: number;
        payment_provider: string;
        payment_created_at: string;
        current_step: {
            id: string;
            extra: string;
            created_at: string;
            order_id: string;
            kind: string;
        };
        items?: {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
            product?: {
                id: string;
                title: string;
                attributes: {
                    id: string;
                    type: string;
                    product_id: string;
                    parent_id: string | null;
                    media_id: string | null;
                    extra: string;
                    children: {
                        id: string;
                        type: string;
                        price: number;
                        sku: string;
                        product_id: string;
                        parent_id: string;
                        media_id: string | null;
                        extra: string;
                        children: unknown[];
                    }[];
                }[];
                description: {
                    title: string;
                    description: string;
                    index: number;
                }[];
                short_description: string;
                price: number;
                rating: number;
                sku: string;
                slug: string;
                currency: string;
                unit: string;
                disable: boolean;
                out_of_stock: boolean;
                media: {
                    id: string;
                    content_type: string;
                    file_id: string;
                    alt: string;
                }[] | null;
                categories: {
                    id: string;
                    title: string;
                }[] | null;
                brands: {
                    id: string;
                    title: string;
                }[] | null;
                weight?: number | undefined;
            } | undefined;
        }[] | undefined;
        items_count?: number | undefined;
    }[];
    page: number;
    size: number;
    total: number;
}, {
    items: {
        number: string;
        id: string;
        currency: string;
        created_at: string;
        total_price: number;
        customer_id: string;
        payment_id: string;
        payment_status: string;
        total_paid: number;
        payment_provider: string;
        payment_created_at: string;
        current_step: {
            id: string;
            extra: string;
            created_at: string;
            order_id: string;
            kind: string;
        };
        items?: {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
            product?: {
                id: string;
                title: string;
                attributes: {
                    id: string;
                    type: string;
                    product_id: string;
                    parent_id: string | null;
                    media_id: string | null;
                    extra: string;
                    children: {
                        id: string;
                        type: string;
                        price: number;
                        sku: string;
                        product_id: string;
                        parent_id: string;
                        media_id: string | null;
                        extra: string;
                        children: unknown[];
                    }[];
                }[];
                short_description: string;
                price: number;
                rating: number;
                sku: string;
                slug: string;
                currency: string;
                unit: string;
                disable: boolean;
                out_of_stock: boolean;
                description?: unknown;
                weight?: number | undefined;
                media?: {
                    id: string;
                    content_type: string;
                    file_id: string;
                    alt: string;
                }[] | null | undefined;
                categories?: {
                    id: string;
                    title: string;
                }[] | null | undefined;
                brands?: {
                    id: string;
                    title: string;
                }[] | null | undefined;
            } | undefined;
        }[] | undefined;
        items_count?: number | undefined;
    }[];
    page: number;
    size: number;
    total: number;
}>;
declare const getOrderSchema: z.ZodObject<{
    id: z.ZodString;
    number: z.ZodString;
    customer_id: z.ZodString;
    address_id: z.ZodString;
    currency: z.ZodString;
    total_price: z.ZodNumber;
    total_paid: z.ZodNumber;
    shipment_service_code: z.ZodString;
    shipment_price: z.ZodNumber;
    created_at: z.ZodString;
    payment_id: z.ZodString;
    payment_provider: z.ZodString;
    payment_status: z.ZodString;
    payment_created_at: z.ZodString;
    items_count: z.ZodNumber;
    current_step: z.ZodObject<{
        id: z.ZodString;
        order_id: z.ZodString;
        kind: z.ZodString;
        extra: z.ZodString;
        created_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        extra: string;
        created_at: string;
        order_id: string;
        kind: string;
    }, {
        id: string;
        extra: string;
        created_at: string;
        order_id: string;
        kind: string;
    }>;
    logs: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        order_id: z.ZodString;
        kind: z.ZodString;
        extra: z.ZodString;
        created_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        extra: string;
        created_at: string;
        order_id: string;
        kind: string;
    }, {
        id: string;
        extra: string;
        created_at: string;
        order_id: string;
        kind: string;
    }>, "many">;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        order_id: z.ZodString;
        cart_id: z.ZodString;
        product_id: z.ZodString;
        product_attribute_id: z.ZodNullable<z.ZodString>;
        price: z.ZodNumber;
        price_updated_at: z.ZodString;
        quantity: z.ZodNumber;
        notes: z.ZodString;
        created_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        price: number;
        product_id: string;
        product_attribute_id: string | null;
        quantity: number;
        notes: string;
        created_at: string;
        order_id: string;
        cart_id: string;
        price_updated_at: string;
    }, {
        id: string;
        price: number;
        product_id: string;
        product_attribute_id: string | null;
        quantity: number;
        notes: string;
        created_at: string;
        order_id: string;
        cart_id: string;
        price_updated_at: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    number: string;
    id: string;
    items: {
        id: string;
        price: number;
        product_id: string;
        product_attribute_id: string | null;
        quantity: number;
        notes: string;
        created_at: string;
        order_id: string;
        cart_id: string;
        price_updated_at: string;
    }[];
    currency: string;
    created_at: string;
    total_price: number;
    customer_id: string;
    payment_id: string;
    payment_status: string;
    address_id: string;
    total_paid: number;
    payment_provider: string;
    payment_created_at: string;
    items_count: number;
    current_step: {
        id: string;
        extra: string;
        created_at: string;
        order_id: string;
        kind: string;
    };
    shipment_service_code: string;
    shipment_price: number;
    logs: {
        id: string;
        extra: string;
        created_at: string;
        order_id: string;
        kind: string;
    }[];
}, {
    number: string;
    id: string;
    items: {
        id: string;
        price: number;
        product_id: string;
        product_attribute_id: string | null;
        quantity: number;
        notes: string;
        created_at: string;
        order_id: string;
        cart_id: string;
        price_updated_at: string;
    }[];
    currency: string;
    created_at: string;
    total_price: number;
    customer_id: string;
    payment_id: string;
    payment_status: string;
    address_id: string;
    total_paid: number;
    payment_provider: string;
    payment_created_at: string;
    items_count: number;
    current_step: {
        id: string;
        extra: string;
        created_at: string;
        order_id: string;
        kind: string;
    };
    shipment_service_code: string;
    shipment_price: number;
    logs: {
        id: string;
        extra: string;
        created_at: string;
        order_id: string;
        kind: string;
    }[];
}>;
declare const createOrderSchema: z.ZodObject<{
    locale: z.ZodString;
    address_id: z.ZodNullable<z.ZodString>;
    payment: z.ZodObject<{
        provider: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        provider: string;
    }, {
        provider: string;
    }>;
    items: z.ZodArray<z.ZodObject<{
        cart_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        cart_id: string;
    }, {
        cart_id: string;
    }>, "many">;
    shipment: z.ZodObject<{
        service_code: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        service_code: string;
    }, {
        service_code: string;
    }>;
}, "strip", z.ZodTypeAny, {
    items: {
        cart_id: string;
    }[];
    address_id: string | null;
    payment: {
        provider: string;
    };
    locale: string;
    shipment: {
        service_code: string;
    };
}, {
    items: {
        cart_id: string;
    }[];
    address_id: string | null;
    payment: {
        provider: string;
    };
    locale: string;
    shipment: {
        service_code: string;
    };
}>;
declare const updateOrderSchema: z.ZodObject<{
    status: z.ZodNumber;
    tax: z.ZodNumber;
    discount: z.ZodNumber;
    delivery_amount: z.ZodNumber;
    final_amount: z.ZodNumber;
    payment_method_id: z.ZodString;
    address_id: z.ZodOptional<z.ZodString>;
    driver_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: number;
    tax: number;
    discount: number;
    delivery_amount: number;
    final_amount: number;
    payment_method_id: string;
    address_id?: string | undefined;
    driver_id?: string | undefined;
}, {
    status: number;
    tax: number;
    discount: number;
    delivery_amount: number;
    final_amount: number;
    payment_method_id: string;
    address_id?: string | undefined;
    driver_id?: string | undefined;
}>;
declare const reviewSchema: z.ZodObject<{
    product_attribute_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    customer_id: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rating: number;
    customer_id: string;
    comment: string;
    product_attribute_id?: string | null | undefined;
}, {
    rating: number;
    customer_id: string;
    comment: string;
    product_attribute_id?: string | null | undefined;
}>;
declare const queryReviewSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        product_id: z.ZodString;
        product_attribute_id: z.ZodNullable<z.ZodString>;
        customer_id: z.ZodString;
        customer_firstname: z.ZodOptional<z.ZodString>;
        customer_lastname: z.ZodOptional<z.ZodString>;
        is_verified: z.ZodOptional<z.ZodBoolean>;
        rating: z.ZodNumber;
        comment: z.ZodString;
        created_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        rating: number;
        product_id: string;
        product_attribute_id: string | null;
        created_at: string;
        customer_id: string;
        comment: string;
        customer_firstname?: string | undefined;
        customer_lastname?: string | undefined;
        is_verified?: boolean | undefined;
    }, {
        id: string;
        rating: number;
        product_id: string;
        product_attribute_id: string | null;
        created_at: string;
        customer_id: string;
        comment: string;
        customer_firstname?: string | undefined;
        customer_lastname?: string | undefined;
        is_verified?: boolean | undefined;
    }>, "many">;
    page: z.ZodNumber;
    size: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    items: {
        id: string;
        rating: number;
        product_id: string;
        product_attribute_id: string | null;
        created_at: string;
        customer_id: string;
        comment: string;
        customer_firstname?: string | undefined;
        customer_lastname?: string | undefined;
        is_verified?: boolean | undefined;
    }[];
    page: number;
    size: number;
    total: number;
}, {
    items: {
        id: string;
        rating: number;
        product_id: string;
        product_attribute_id: string | null;
        created_at: string;
        customer_id: string;
        comment: string;
        customer_firstname?: string | undefined;
        customer_lastname?: string | undefined;
        is_verified?: boolean | undefined;
    }[];
    page: number;
    size: number;
    total: number;
}>;
declare const addToFavoritesSchema: z.ZodObject<{
    product_attribute_id: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    product_attribute_id: string | null;
}, {
    product_attribute_id: string | null;
}>;
declare const queryFavoritesSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        customer_id: z.ZodString;
        product_id: z.ZodString;
        product_attribute_id: z.ZodNullable<z.ZodString>;
        product_cover_media_id: z.ZodString;
        price: z.ZodNumber;
        sku: z.ZodString;
        slug: z.ZodString;
        out_of_stock: z.ZodBoolean;
        media_id: z.ZodString;
        media_content_type: z.ZodLiteral<"image">;
        media_file_id: z.ZodString;
        created_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        price: number;
        sku: string;
        slug: string;
        out_of_stock: boolean;
        product_id: string;
        media_id: string;
        media_content_type: "image";
        media_file_id: string;
        product_attribute_id: string | null;
        created_at: string;
        customer_id: string;
        product_cover_media_id: string;
    }, {
        id: string;
        title: string;
        price: number;
        sku: string;
        slug: string;
        out_of_stock: boolean;
        product_id: string;
        media_id: string;
        media_content_type: "image";
        media_file_id: string;
        product_attribute_id: string | null;
        created_at: string;
        customer_id: string;
        product_cover_media_id: string;
    }>, "many">;
    page: z.ZodNumber;
    size: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    items: {
        id: string;
        title: string;
        price: number;
        sku: string;
        slug: string;
        out_of_stock: boolean;
        product_id: string;
        media_id: string;
        media_content_type: "image";
        media_file_id: string;
        product_attribute_id: string | null;
        created_at: string;
        customer_id: string;
        product_cover_media_id: string;
    }[];
    page: number;
    size: number;
    total: number;
}, {
    items: {
        id: string;
        title: string;
        price: number;
        sku: string;
        slug: string;
        out_of_stock: boolean;
        product_id: string;
        media_id: string;
        media_content_type: "image";
        media_file_id: string;
        product_attribute_id: string | null;
        created_at: string;
        customer_id: string;
        product_cover_media_id: string;
    }[];
    page: number;
    size: number;
    total: number;
}>;
declare const shippingRatesSchema: z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    delivery: z.ZodObject<{
        guaranteed_delivery: z.ZodBoolean;
        expected_transit_time: z.ZodNumber;
        expected_delivery_date: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        guaranteed_delivery: boolean;
        expected_transit_time: number;
        expected_delivery_date: string;
    }, {
        guaranteed_delivery: boolean;
        expected_transit_time: number;
        expected_delivery_date: string;
    }>;
    pricing_details: z.ZodObject<{
        base: z.ZodNumber;
        taxes: z.ZodObject<{
            gst: z.ZodNumber;
            pst: z.ZodNumber;
            hst: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            gst: number;
            pst: number;
            hst: number;
        }, {
            gst: number;
            pst: number;
            hst: number;
        }>;
        due: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        base: number;
        taxes: {
            gst: number;
            pst: number;
            hst: number;
        };
        due: number;
    }, {
        base: number;
        taxes: {
            gst: number;
            pst: number;
            hst: number;
        };
        due: number;
    }>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    delivery: {
        guaranteed_delivery: boolean;
        expected_transit_time: number;
        expected_delivery_date: string;
    };
    pricing_details: {
        base: number;
        taxes: {
            gst: number;
            pst: number;
            hst: number;
        };
        due: number;
    };
}, {
    code: string;
    name: string;
    delivery: {
        guaranteed_delivery: boolean;
        expected_transit_time: number;
        expected_delivery_date: string;
    };
    pricing_details: {
        base: number;
        taxes: {
            gst: number;
            pst: number;
            hst: number;
        };
        due: number;
    };
}>, "many">;
declare const tgsGenerateSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
type AddressFormData = z.infer<typeof addressFormSchema>;
type Address = z.infer<typeof addressSchema>;
type Product$1 = z.infer<typeof productSchema>;
type Order$1 = z.infer<typeof getOrderSchema>;
type Customer$1 = z.infer<typeof customerSchema>;
type User = z.infer<typeof authUserSchema>;
type CategoryListItem = z.infer<typeof categoryListItemSchema>;
type ProductListItem = z.infer<typeof productListItemSchema>;

declare class Auth extends BaseClient {
    login({ username, password, turnstileToken, }: {
        username: string;
        password: string;
        turnstileToken: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
        access_token_expiration: number;
        refresh_token_expiration: number;
        user: {
            id: string;
            name: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            createAt: string;
            enabled: boolean;
            tenant: string;
            tenantLanguages: string[];
            attributes: {
                permissionId: string[];
                jobTitle: string[];
                local: string[];
            };
        };
        customer: {
            id: string;
            email: string;
            external_user_id: string;
            firstname: string;
            lastname: string;
            language: string;
            phonenumber: string;
            gender: number;
            date_of_birth: string | null;
            addresses: {
                id: string;
                title: string;
                phonenumber: string;
                country: string;
                state: string;
                city: string;
                address1: string;
                address2: string;
                is_default: boolean;
                postal_code: string;
            }[] | null;
        };
        address?: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        } | null | undefined;
    }>;
    logout(): Promise<void>;
    register({ firstName, lastName, email, password, turnstileToken, address, languages, locale, permissionId, jobTitle, }: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        turnstileToken: string;
        address?: z.infer<typeof createAddressSchema>;
        languages: string;
        locale: string;
        permissionId: string;
        jobTitle: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
        access_token_expiration: number;
        refresh_token_expiration: number;
        user: {
            id: string;
            name: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            createAt: string;
            enabled: boolean;
            tenant: string;
            tenantLanguages: string[];
            attributes: {
                permissionId: string[];
                jobTitle: string[];
                local: string[];
            };
        };
        customer: {
            id: string;
            email: string;
            external_user_id: string;
            firstname: string;
            lastname: string;
            language: string;
            phonenumber: string;
            gender: number;
            date_of_birth: string | null;
            addresses: {
                id: string;
                title: string;
                phonenumber: string;
                country: string;
                state: string;
                city: string;
                address1: string;
                address2: string;
                is_default: boolean;
                postal_code: string;
            }[] | null;
        };
        address?: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        } | null | undefined;
    }>;
}

declare class Cart extends BaseClient {
    get({ cartId, params, }: {
        cartId: string;
        params: {
            locale: string;
        };
    }): Promise<{
        items: {
            id: string;
            product_id: string;
            quantity: number;
            device_token: string;
            notes: string;
            created_at: string;
            total_price: number;
            product: {
                id: string;
                title: string;
                attributes: {
                    id: string;
                    type: string;
                    product_id: string;
                    parent_id: string | null;
                    media_id: string | null;
                    extra: string;
                    children: unknown[];
                    price?: number | null | undefined;
                }[];
                description: string;
                short_description: string;
                rating: number;
                sku: string;
                slug: string;
                currency: string;
                unit: string;
                disable: boolean;
                out_of_stock: boolean;
                media: {
                    id: string;
                    content_type: string;
                    file_id: string;
                    alt: string;
                }[] | null;
                categories: {
                    id: string;
                    title: string;
                }[] | null;
                brands: {
                    id: string;
                    title: string;
                }[] | null;
                reviews_count: number;
                price?: number | null | undefined;
            };
            product_attribute_id?: string | undefined;
        }[];
        total_price: number;
    }>;
    upsert({ body }: {
        body: z.infer<typeof upsertCartSchema>;
    }): Promise<void>;
    add({ body }: {
        body: z.infer<typeof upsertCartSchema>;
    }): Promise<void>;
    query({ query, }: {
        query: {
            device_token: string;
            quantity?: number;
            customer_id?: string;
            locale: string;
        };
    }): Promise<{
        items: {
            id: string;
            product_id: string;
            quantity: number;
            device_token: string;
            notes: string;
            created_at: string;
            total_price: number;
            product: {
                id: string;
                title: string;
                attributes: {
                    id: string;
                    type: string;
                    product_id: string;
                    parent_id: string | null;
                    media_id: string | null;
                    extra: string;
                    children: unknown[];
                    price?: number | null | undefined;
                }[];
                description: string;
                short_description: string;
                rating: number;
                sku: string;
                slug: string;
                currency: string;
                unit: string;
                disable: boolean;
                out_of_stock: boolean;
                media: {
                    id: string;
                    content_type: string;
                    file_id: string;
                    alt: string;
                }[] | null;
                categories: {
                    id: string;
                    title: string;
                }[] | null;
                brands: {
                    id: string;
                    title: string;
                }[] | null;
                reviews_count: number;
                price?: number | null | undefined;
            };
            product_attribute_id?: string | undefined;
        }[];
        total_price: number;
    } | undefined>;
    removeItem({ cartItemId }: {
        cartItemId: string;
    }): Promise<void>;
}

declare class Category extends BaseClient {
    query({ query, }: {
        query: {
            lang: string;
            page: number;
            size: number;
        };
    }): Promise<{
        items: {
            id: string;
            title: string;
            parent_id: string | null;
            media_id: string | null;
            children: {
                id: string;
                title: string;
                parent_id: string;
                media_id: string | null;
                children: unknown[];
            }[];
            products: number;
        }[] | null;
        page: number;
        size: number;
        total: number;
    }>;
}

declare class Customer extends BaseClient {
    get(): Promise<{
        id: string;
        email: string;
        external_user_id: string;
        firstname: string;
        lastname: string;
        language: string;
        phonenumber: string;
        gender: number;
        date_of_birth: string | null;
        addresses: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }[] | null;
    } | null>;
    getByUserId({ headers, userId, }: {
        headers: AuthHeaders;
        userId: string;
    }): Promise<{
        id: string;
        email: string;
        external_user_id: string;
        firstname: string;
        lastname: string;
        language: string;
        phonenumber: string;
        gender: number;
        date_of_birth: string | null;
        addresses: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }[] | null;
    } | null>;
    create({ headers, body, }: {
        headers: AuthHeaders;
        body: z.infer<typeof createCustomerSchema>;
    }): Promise<{
        id: string;
        email: string;
        external_user_id: string;
        firstname: string;
        lastname: string;
        language: string;
        phonenumber: string;
        gender: number;
        date_of_birth: string | null;
        addresses: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }[] | null;
    }>;
    update({ customerId, body, }: {
        customerId: string;
        body: z.infer<typeof updateCustomerSchema>;
    }): Promise<{
        id: string;
        email: string;
        external_user_id: string;
        firstname: string;
        lastname: string;
        language: string;
        phonenumber: string;
        gender: number;
        date_of_birth: string | null;
        addresses: {
            id: string;
            title: string;
            phonenumber: string;
            country: string;
            state: string;
            city: string;
            address1: string;
            address2: string;
            is_default: boolean;
            postal_code: string;
        }[] | null;
    }>;
    query({ query, }: {
        query: {
            page?: number;
            size?: number;
            firstname?: string;
            lastname?: string;
            language?: string;
        };
    }): Promise<{
        items: {
            id: string;
            email: string;
            external_user_id: string;
            firstname: string;
            lastname: string;
            language: string;
            phonenumber: string;
            gender: number;
            date_of_birth: string | null;
            addresses: {
                id: string;
                title: string;
                phonenumber: string;
                country: string;
                state: string;
                city: string;
                address1: string;
                address2: string;
                is_default: boolean;
                postal_code: string;
            }[] | null;
        }[];
        page: number;
        size: number;
        total: number;
    }>;
    createAddress({ body, }: {
        body: z.infer<typeof createAddressSchema>;
    }): Promise<{
        id: string;
        title: string;
        phonenumber: string;
        country: string;
        state: string;
        city: string;
        address1: string;
        address2: string;
        is_default: boolean;
        postal_code: string;
    }>;
    updateAddress({ customerId, addressId, body, }: {
        customerId: string;
        addressId: string;
        body: z.infer<typeof updateAddressSchema>;
    }): Promise<{
        id: string;
        title: string;
        phonenumber: string;
        country: string;
        state: string;
        city: string;
        address1: string;
        address2: string;
        is_default: boolean;
        postal_code: string;
    }>;
    deleteAddress({ customerId, addressId, }: {
        customerId: string;
        addressId: string;
    }): Promise<void>;
}

declare class Order extends BaseClient {
    getShippingRates({ body, }: {
        body: {
            postal_code: string;
            country_code: string;
        };
    }): Promise<{
        code: string;
        name: string;
        delivery: {
            guaranteed_delivery: boolean;
            expected_transit_time: number;
            expected_delivery_date: string;
        };
        pricing_details: {
            base: number;
            taxes: {
                gst: number;
                pst: number;
                hst: number;
            };
            due: number;
        };
    }[]>;
    get({ orderId }: {
        orderId: string;
    }): Promise<{
        number: string;
        id: string;
        items: {
            id: string;
            price: number;
            product_id: string;
            product_attribute_id: string | null;
            quantity: number;
            notes: string;
            created_at: string;
            order_id: string;
            cart_id: string;
            price_updated_at: string;
        }[];
        currency: string;
        created_at: string;
        total_price: number;
        customer_id: string;
        payment_id: string;
        payment_status: string;
        address_id: string;
        total_paid: number;
        payment_provider: string;
        payment_created_at: string;
        items_count: number;
        current_step: {
            id: string;
            extra: string;
            created_at: string;
            order_id: string;
            kind: string;
        };
        shipment_service_code: string;
        shipment_price: number;
        logs: {
            id: string;
            extra: string;
            created_at: string;
            order_id: string;
            kind: string;
        }[];
    }>;
    create({ body }: {
        body: z.infer<typeof createOrderSchema>;
    }): Promise<{
        order: {
            id: string;
            items: {
                id: string;
                price: number;
                product_id: string;
                product_attribute_id: string | null;
                quantity: number;
                notes: string;
                created_at: string;
                order_id: string;
                cart_id: string;
                price_updated_at: string;
            }[];
            currency: string;
            created_at: string;
            total_price: number;
            customer_id: string;
            payment_id: string;
            payment_status: string;
            address_id: string;
            total_paid: number;
            payment_provider: string;
            payment_created_at: string;
        };
        payment: {
            id: string;
            status: number;
            created_at: string;
            order_id: string;
            provider: string;
            amount: number;
            provider_extra_information: {
                id: string;
                payment_id: string;
                url: string;
                payment_status: string;
                session_status: string;
                session_expires_at: number;
                session_created_at: number;
            };
        };
    }>;
    update({ orderId, body, }: {
        orderId: string;
        body: z.infer<typeof updateOrderSchema>;
    }): Promise<{
        order: {
            id: string;
            items: {
                id: string;
                price: number;
                product_id: string;
                product_attribute_id: string | null;
                quantity: number;
                notes: string;
                created_at: string;
                order_id: string;
                cart_id: string;
                price_updated_at: string;
            }[];
            currency: string;
            created_at: string;
            total_price: number;
            customer_id: string;
            payment_id: string;
            payment_status: string;
            address_id: string;
            total_paid: number;
            payment_provider: string;
            payment_created_at: string;
        };
        payment: {
            id: string;
            status: number;
            created_at: string;
            order_id: string;
            provider: string;
            amount: number;
            provider_extra_information: {
                id: string;
                payment_id: string;
                url: string;
                payment_status: string;
                session_status: string;
                session_expires_at: number;
                session_created_at: number;
            };
        };
    }>;
    query({ query, }: {
        query: {
            status?: number;
            page?: number;
            size?: number;
            locale: string;
        };
    }): Promise<{
        items: {
            number: string;
            id: string;
            currency: string;
            created_at: string;
            total_price: number;
            customer_id: string;
            payment_id: string;
            payment_status: string;
            total_paid: number;
            payment_provider: string;
            payment_created_at: string;
            current_step: {
                id: string;
                extra: string;
                created_at: string;
                order_id: string;
                kind: string;
            };
            items?: {
                id: string;
                price: number;
                product_id: string;
                product_attribute_id: string | null;
                quantity: number;
                notes: string;
                created_at: string;
                order_id: string;
                cart_id: string;
                price_updated_at: string;
                product?: {
                    id: string;
                    title: string;
                    attributes: {
                        id: string;
                        type: string;
                        product_id: string;
                        parent_id: string | null;
                        media_id: string | null;
                        extra: string;
                        children: {
                            id: string;
                            type: string;
                            price: number;
                            sku: string;
                            product_id: string;
                            parent_id: string;
                            media_id: string | null;
                            extra: string;
                            children: unknown[];
                        }[];
                    }[];
                    description: {
                        title: string;
                        description: string;
                        index: number;
                    }[];
                    short_description: string;
                    price: number;
                    rating: number;
                    sku: string;
                    slug: string;
                    currency: string;
                    unit: string;
                    disable: boolean;
                    out_of_stock: boolean;
                    media: {
                        id: string;
                        content_type: string;
                        file_id: string;
                        alt: string;
                    }[] | null;
                    categories: {
                        id: string;
                        title: string;
                    }[] | null;
                    brands: {
                        id: string;
                        title: string;
                    }[] | null;
                    weight?: number | undefined;
                } | undefined;
            }[] | undefined;
            items_count?: number | undefined;
        }[];
        page: number;
        size: number;
        total: number;
    }>;
    delete({ orderId }: {
        orderId: string;
    }): Promise<void>;
}

declare class Product extends BaseClient {
    get({ query, productId, }: {
        query: {
            lang: string;
        };
        productId: string;
    }): Promise<{
        id: string;
        title: string;
        attributes: {
            id: string;
            type: string;
            product_id: string;
            parent_id: string | null;
            media_id: string | null;
            extra: string;
            children: {
                id: string;
                type: string;
                price: number;
                sku: string;
                product_id: string;
                parent_id: string;
                media_id: string | null;
                extra: string;
                children: unknown[];
            }[];
        }[];
        description: {
            title: string;
            description: string;
            index: number;
        }[];
        short_description: string;
        price: number;
        rating: number;
        sku: string;
        slug: string;
        currency: string;
        unit: string;
        disable: boolean;
        out_of_stock: boolean;
        media: {
            id: string;
            content_type: string;
            file_id: string;
            alt: string;
        }[] | null;
        categories: {
            id: string;
            title: string;
        }[] | null;
        brands: {
            id: string;
            title: string;
        }[] | null;
        weight?: number | undefined;
    }>;
    query({ query, }: {
        query: {
            locale: string;
            page: number;
            size: number;
            categoryId?: string;
            title?: string;
        };
    }): Promise<{
        items: {
            id: string;
            title: string;
            price: number;
            sku: string;
            slug: string | null;
            currency: string;
            unit: string;
            out_of_stock: boolean;
            media_id: string | null;
            media_content_type: string | null;
            media_file_id: string | null;
            category_id: string | null;
            category_title: string | null;
            brand_id: string | null;
            brand_title: string | null;
            weight?: number | undefined;
        }[];
        page: number;
        size: number;
        total: number;
    }>;
    review({ body, params, }: {
        body: z.infer<typeof reviewSchema>;
        params: {
            id: string;
        };
    }): Promise<any>;
    queryReviews({ params, query, }: {
        params: {
            id: string;
        };
        query: {
            page: number;
            size: number;
        };
    }): Promise<{
        items: {
            id: string;
            rating: number;
            product_id: string;
            product_attribute_id: string | null;
            created_at: string;
            customer_id: string;
            comment: string;
            customer_firstname?: string | undefined;
            customer_lastname?: string | undefined;
            is_verified?: boolean | undefined;
        }[];
        page: number;
        size: number;
        total: number;
    }>;
    favorites: {
        query: ({ query, }: {
            query: {
                page: number;
                size: number;
                locale: string;
            };
        }) => Promise<{
            items: {
                id: string;
                title: string;
                price: number;
                sku: string;
                slug: string;
                out_of_stock: boolean;
                product_id: string;
                media_id: string;
                media_content_type: "image";
                media_file_id: string;
                product_attribute_id: string | null;
                created_at: string;
                customer_id: string;
                product_cover_media_id: string;
            }[];
            page: number;
            size: number;
            total: number;
        }>;
        delete: ({ body, productId, faveId, }: {
            body: z.infer<typeof addToFavoritesSchema>;
            productId: string;
            faveId: string;
        }) => Promise<void>;
        add: ({ body, productId, }: {
            body: z.infer<typeof addToFavoritesSchema>;
            productId: string;
        }) => Promise<void>;
        get: ({ productId, locale, }: {
            productId: string;
            locale: string;
        }) => Promise<string | null>;
    };
}

declare class TGS extends BaseClient {
    generate({ device_identifier }: {
        device_identifier: string;
    }): Promise<{
        token: string;
    }>;
}

declare class EcommerceSDK {
    readonly tgs: TGS;
    readonly auth: Auth;
    readonly product: Product;
    readonly category: Category;
    readonly cart: Cart;
    readonly order: Order;
    readonly customer: Customer;
    constructor(config: SDKConfig);
}

export { type Address, type AddressFormData, type AuthHeaders, type CategoryListItem, type Customer$1 as Customer, EcommerceSDK, type Order$1 as Order, type Product$1 as Product, type ProductListItem, type SDKConfig, SDKError, type User, addToFavoritesSchema, addressFormSchema, addressSchema, authUserSchema, brandSchema, cartListSchema, categoryListItemSchema, categoryListSchema, categorySchema, createAddressSchema, createCustomerSchema, createOrderSchema, customerListSchema, customerSchema, EcommerceSDK as default, getOrderItemSchema, getOrderSchema, loginResponseSchema, mediaSchema, orderItemSchema, orderListSchema, orderPaymentSchema, orderSchema, phoneSchema, productListItemSchema, productListSchema, productSchema, queryFavoritesSchema, queryReviewSchema, reviewSchema, shippingRatesSchema, tgsGenerateSchema, updateAddressSchema, updateCustomerSchema, updateOrderSchema, upsertCartSchema };
