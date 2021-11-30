import arg from 'arg';
import inquirer from 'inquirer';
import pkg from '../package.json';
import { genEntity } from './lib/gen';
import { readORMConfig } from './lib/readORMFile';
import { writeToFile } from './lib/writeToFile';

const Types = ['int', 'int2', 'int4', 'int8', 'smallint', 'integer', 'bigint', 'decimal', 'numeric', 'real', 'float', 'float4', 'float8', 'double precision', 'money', 'character varying', 'varchar', 'character', 'char', 'text', 'citext', 'hstore', 'bytea', 'bit', 'varbit', 'bit varying', 'timetz', 'timestamptz', 'timestamp', 'timestamp without time zone', 'timestamp with time zone', 'date', 'time', 'time without time zone', 'time with time zone', 'interval', 'bool', 'boolean', 'enum', 'point', 'line', 'lseg', 'box', 'path', 'polygon', 'circle', 'cidr', 'inet', 'macaddr', 'tsvector', 'tsquery', 'uuid', 'xml', 'json', 'jsonb', 'int4range', 'int8range', 'numrange', 'tsrange', 'tstzrange', 'daterange', 'geometry', 'geography', 'cube', 'ltree']

const Args = (args: string[]): arg.Result<{
    '--help': BooleanConstructor;
    '--version': BooleanConstructor;
    '--input': StringConstructor;
    '-h': string;
    '-v': string;
    '-i': string;
}> => {
    const a = arg(
        {
            '--help': Boolean,
            '--version': Boolean,
            '--input': String,
            '-h': '--help',
            '-v': '--version',
            '-i': '--input'
        },
        {
            argv: args.slice(2),
        }
    );

    // return {
    //     help: a['--help'] || a['-h'],
    //     version: a['--version'] || a['-v'],
    // };


    if (a['--help']) {
        console.log(
            'Usage:',
            '\n',
            '  $ npx @npm/cli',
            '\n',
            'Options:',
            '\n',
            '  --help  Show help',
            '  --version  Show version',
        );
        process.exit(0);
    }

    if (a['--version']) {
        console.log(pkg.version);
        process.exit(0);
    }

    return a;
}

export interface IEntity {
    name?: string;
    columns?: 
        {
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
        }[]
}

const Input = async(): Promise<IEntity> => {

    let entity: IEntity = {
        name: '',
        columns: []
    }
    

    const {name} = await inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Entity name',
        default: '',
    }])
    const {amount_of_columns}: {amount_of_columns: number} = await inquirer.prompt([
        {
            type: 'number',
            name: 'amount_of_columns',
            message: 'Amount of Columns',
            default: 1,
        },
    ]);

    entity.name = name;

    for(let i = 0; i < amount_of_columns; i++) {
        // let primaryKeyType: Record<any, any>, columnType: Record<any, any>, columnUnique: Record<any, any>, columnDefault: Record<any, any> = {};
        const columnName = await inquirer.prompt([
            {
                type: 'input',
                name: `column_name${i + 1}`,
                message: `Column ${i + 1} name`,
                default: '',
            },
        ]);

        const isPrimaryKey = await inquirer.prompt([
            {
                type: 'confirm',
                name: `isPrimaryKey${i + 1}`,
                message: `Is this column a primary key?`,
                default: false,
            },
        ]);

        
        if(isPrimaryKey !== undefined && isPrimaryKey !== null && isPrimaryKey[`isPrimaryKey${i + 1}`] &&  isPrimaryKey[`isPrimaryKey${i + 1}`] === true) {
             const primaryKeyType = await inquirer.prompt([
                {
                    type: 'list',
                    name: `primaryKeyType${i + 1}`,
                    message: `Primary key type`,
                    choices: ['uuid', 'rowid', 'increment'],
        }
            ]);

            const columnTSType = await inquirer.prompt([
                {
                    type: 'list',
                    name: `column_ts_type${i + 1}`,
                    message: `Column ${i + 1} type`,
                    choices: ['string', 'number', 'boolean'],
                    default: 'varchar',
                },
            ]);

            if(entity.columns) {
            entity.columns.push({
                idx: i,
                name: columnName[`column_name${i + 1}`] as string,
                isPrimaryKey: isPrimaryKey[`isPrimaryKey${i + 1}`] as boolean,
                primaryKeyType: primaryKeyType[`primaryKeyType${i + 1}`] as string,
                columnTSType: columnTSType[`column_ts_type${i + 1}`] as string,
            })
        }
        } else {
             const columnType = await inquirer.prompt([
                {
                    type: 'list',
                    name: `column_type${i + 1}`,
                    message: `Column ${i + 1} type`,
                    choices: Types,
                    default: 'varchar',
                },
            ]);
            const columnTSType = await inquirer.prompt([
                {
                    type: 'list',
                    name: `column_ts_type${i + 1}`,
                    message: `Column ${i + 1} type`,
                    choices: ['string', 'number', 'boolean'],
                    default: 'varchar',
                },
            ]);

            const columnLength = await inquirer.prompt([
                {
                    type: 'number',
                    name: `column_length${i + 1}`,
                    message: `Column ${i + 1} length`,
                    default: 255,
                },
            ]);

            const columnUnique = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: `column_unique${i + 1}`,
                    message: `Is this column unique?`,
                    default: false,
                },
            ]);
            const columnNullable = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: `column_nullable${i + 1}`,
                    message: `Is this column nullable?`,
                    default: false,
                },
            ]);
                

            const columnDefault = await inquirer.prompt([
                {
                    type: 'input',
                    name: `column_default${i + 1}`,
                    message: `Column ${i + 1} default value`,
                    default: '',
                },
            ]);


            if(entity.columns) {
                entity.columns.push({
                    idx: i,
                    name: columnName[`column_name${i + 1}`] as string,
                    isPrimaryKey: isPrimaryKey[`isPrimaryKey${i + 1}`] as boolean,
                    columnType: columnType[`column_type${i + 1}`] as string,
                    columnTSType: columnTSType[`column_ts_type${i + 1}`] as string,
                    columnLength: columnLength[`column_length${i + 1}`] as number,
                    columnUnique: columnUnique[`column_unique${i + 1}`] as boolean,
                    columnDefault: columnDefault[`column_default${i + 1}`] as string|number,
                    columnNullable: columnNullable[`column_nullable${i + 1}`] as boolean,
                })
            }
        }
    }

    return entity;
}


// (async() => {
//     const template = await genEntity({
//         name: 'User',
//         columns: [
//           { idx: 0, name: 'id', isPrimaryKey: true, primaryKeyType: 'uuid' },
//           {
//             idx: 1,
//             name: 'name',
//             isPrimaryKey: false,
//             columnType: 'varchar',
//             columnLength: 255,
//             columnUnique: false,
//             columnDefault: '',
//             columnNullable: false
//           },
//           {
//             idx: 2,
//             name: 'password',
//             isPrimaryKey: false,
//             columnType: 'varchar',
//             columnLength: 255,
//             columnUnique: false,
//             columnDefault: '',
//             columnNullable: false
//           },
//           {
//             idx: 3,
//             name: 'email',
//             isPrimaryKey: false,
//             columnType: 'varchar',
//             columnLength: 255,
//             columnUnique: false,
//             columnDefault: '',
//             columnNullable: false
//           }
//         ]
//       })
//       console.log(template) 
// })()


const cli = async(args: string[]) => {
    const arg = Args(args);
    let dir = ''
    if(arg['--input']) {
        const input = arg['--input'];
        const config = await readORMConfig(input);
        dir = config.entities[0].split('*')[0];
    }
    const entity = await Input()
    const template = await genEntity(entity)
    writeToFile({dir, filename: entity.name ? entity.name[0].toUpperCase()+entity.name?.slice(1)+'.ts': `${Math.floor(Math.random()* 1000)}<Please-change>.ts`}, template as string)
    console.log(entity);
}

cli(process.argv);
