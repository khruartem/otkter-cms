type PrismaErrorCodes = 'P2002' | 'P2003' | 'P2025';

export type PrismaErrorMessages = Partial<Record<PrismaErrorCodes, string>>;
