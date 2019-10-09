import { Igreja } from './../igreja';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { EventEmitter } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { Regiao } from '../../regiao/regiao';

@Component({
    selector: 'app-igreja-modal',
    templateUrl: './igreja-modal.component.html',
    styleUrls: ['./igreja-modal.component.scss']
})
export class IgrejaModalComponent {

    @ViewChild('createModal') createModal: ModalDirective;
    public igreja = new Igreja;
    public regioes: any[];
    public tecnicos: any[];
    public geoLocationNotSupp = false;

    public isLoaded: boolean;

    public lat:any;
    public lng:any;

    public states = [
        { value: '' , estado: 'Selecione um estado'},
        { value: 'AC', estado: 'Acre' },
        { value: 'AL', estado: 'Alagoas' },
        { value: 'AP', estado: 'Amapá' },
        { value: 'AM', estado: 'Amazonas' },
        { value: 'BA', estado: 'Bahia' },
        { value: 'CE', estado: 'Ceará' },
        { value: 'DF', estado: 'Distrito Federal' },
        { value: 'ES', estado: 'Espírito Santo' },
        { value: 'GO', estado: 'Goiás' },
        { value: 'MA', estado: 'Maranhão' },
        { value: 'MT', estado: 'Mato Grosso' },
        { value: 'MS', estado: 'Mato Grosso do Sul' },
        { value: 'MG', estado: 'Minas Gerais' },
        { value: 'PA', estado: 'Pará' },
        { value: 'PB', estado: 'Paraíba' },
        { value: 'PR', estado: 'Paraná' },
        { value: 'PE', estado: 'Pernambuco' },
        { value: 'PI', estado: 'Piauí' },
        { value: 'RJ', estado: 'Rio de Janeiro' },
        { value: 'RN', estado: 'Rio Grande do Norte' },
        { value: 'RS', estado: 'Rio Grande do Sul' },
        { value: 'RO', estado: 'Rondônia' },
        { value: 'RR', estado: 'Roraima' },
        { value: 'SC', estado: 'Santa Catarina' },
        { value: 'SP', estado: 'São Paulo' },
        { value: 'SE', estado: 'Sergipe' },
        { value: 'TO', estado: 'Tocantins' }
    ];

    constructor(private angularFire: AngularFireDatabase, private toastr: ToastrService) { }


    checkLocale() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setLocale.bind(this));
            this.geoLocationNotSupp = false;
        } else {
            this.geoLocationNotSupp = true;
        }
    }

    setLocale(position) {
        this.igreja.lat = position.coords.latitude;
        this.igreja.lng = position.coords.longitude;
    }

    showModal(e?): void {
        if (e) {
            this.igreja = e;
        } else {
            this.igreja = new Igreja;
            const x = new Date();
            this.igreja.id = `${x.getDate()}${x.getMonth() + 1}${x.getUTCFullYear()}` +
                `${x.getHours()}${x.getMinutes()}${x.getSeconds()}${x.getMilliseconds()}`;
            this.igreja.uf = this.states[0].value;
        }
        this.createModal.show();
    }

    dismissModal(): void {
        this.igreja = new Igreja;
        this.createModal.hide();
    }

    onSubmit(form: NgForm): void {
        form.value.numCel = form.value.numCel ? form.value.numCel : '';
        form.value.ordemServico = this.igreja.ordemServico ? this.igreja.ordemServico : [];
        this.angularFire.list(`regioes/${localStorage.getItem('userCity')}/igrejas/`).set(`${this.igreja.id}`, form.value).then((t: any) => {
            this.createModal.hide();
            this.igreja = new Igreja;
            this.toastr.success('Igreja salva com sucesso!', 'Sucesso!');
        }).catch((reason: any) => {
            this.toastr.error(`Ops! Algo de inesperado ocorreu!`, 'Erro!');
            console.error(reason);
        });
    }


    private getEncarregados() {
        this.angularFire.list(`tecnicos`).valueChanges().subscribe(
            data => this.tecnicos = data
        );
    }

}
