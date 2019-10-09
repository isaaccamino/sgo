import { Tecnico } from '../tecnico/tecnico';

export class Igreja {
    id: any;
    codCCB: any = '';
    regiao: string;
    nomeIgreja: String = '';
    rua: String  = '';
    numero: any = '';
    bairro: String = '';
    cep: any = '';
    cidade: any;
    uf: any  = '';
    tecnico: String = '';
    numCel:  any = '';
    marca: String = '';
    modelo: String = '';
    numeroOrgao: any = '';
    numeroPatrimonio: any = '';
    acessorio?: any = '';
    numeroSerieAcessorio?: any = '';
    lat?: any = '';
    lng?: any = '';
    ordemServico: {osNumber: string, status: string};
}
