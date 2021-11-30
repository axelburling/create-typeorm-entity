export interface ORMCONFIG {
        synchronize: true,
        logging: false,
        entities: string[],
        subscribers: string[],
        migrations: string[],
        name?: string,
        type?: string,
        host?: string,
        port?: number,
        url?: string
        username?: string,
        password?: string,
        database?: string,
        cli?: Record<string, any>
}

export interface Column  {
    idx?: number;
    name?: string;
    isPrimaryKey?: boolean;
    primaryKeyType?: string;
    columnType?: string;
    columnTSType?: string;
    columnLength?: number;
    columnUnique?: boolean;
    columnDefault?: string|number;
    columnNullable?: boolean;
}