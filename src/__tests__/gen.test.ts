import { IEntity } from '../cli';
import { genEntity } from '../gen';


it('testing my generator', () => {

    const entity: IEntity = {
        name: 'test',
        columns: [
            {
                idx: 0,
                name: 'id',
                isPrimaryKey: true,
                primaryKeyType: 'uuid',
                columnTSType: 'string',
            },
            {
                idx: 1,
                name: 'name',
                isPrimaryKey: false,
                columnType: 'varchar',
                columnTSType: 'string',
                columnLength: 255,
                columnUnique: false,
                columnDefault: '',
                columnNullable: false
            },
            {
                idx: 2,
                name: 'password',
                isPrimaryKey: false,
                columnType: 'varchar',
                columnTSType: 'string',
                columnLength: 255,
                columnUnique: false,
                columnDefault: '',
                columnNullable: false
            },
            {
                idx: 3,
                name: 'email',
                isPrimaryKey: false,
                columnType: 'varchar',
                columnTSType: 'string',
                columnLength: 255,
                columnUnique: false,
                columnDefault: '',
                columnNullable: false
            }
        ]
    }


    const template = genEntity(entity);
    console.log(template)

 });