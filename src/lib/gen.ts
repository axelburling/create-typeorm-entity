import { IEntity } from "../cli";

interface Column  {
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

export const genEntity = ({name, columns}: IEntity): string | Error => {
    if(!name || !columns) {
        throw new Error('name and columns are required')
    }
return `
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity({name: '${name.toLowerCase()}s'})
export class ${name[0].toUpperCase() + name.slice(1)} extends BaseEntity {
    @PrimaryGeneratedColumn('${columns[0].primaryKeyType}')
    ${columns[0].name}: ${columns[0].columnTSType};
${columns.filter((c: Column) => c.isPrimaryKey !== true).map((c: Column) => `
    @Column${'({'}
        name: '${c.name}',
        type: '${c.columnType}',
        length: ${c.columnLength},
        unique: ${c.columnUnique},
        ${!c.columnDefault ? '': `default: ${c.columnDefault},`}
        nullable: ${c.columnNullable},
        )}
    ${c.name}: ${c.columnTSType};
`).join('')}
${'}'}

export default ${name[0].toUpperCase() + name.slice(1).toLowerCase()};    
`
};

