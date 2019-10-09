import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CrudService } from '../../../shared/services/crud.service';

import { ModalDirective } from 'ngx-bootstrap';

import { OrdemServico } from '../OrdemServico';
import { Tecnico } from '../../tecnico/tecnico';

import * as moment from 'moment';


@Component({
    selector: 'app-ordem-servico-modal',
    templateUrl: './ordem-servico-modal.component.html',
    styleUrls: ['./ordem-servico-modal.component.scss'],
    providers: [AngularFireDatabase, SharedService, CrudService]
})
export class OrdemServicoModalComponent implements OnInit {
    @ViewChild('createModal') createModal: ModalDirective;
    public ordemServico: OrdemServico = new OrdemServico;
    public isEditing = false;
    public churches;
    public allStatus;
    public roleUser: String;
    public tecnicos;
    public subscription: Subscription;
    public userLat: number;
    public userLng: number;
    public totalOSValue: number;

    constructor(private angularFire: AngularFireDatabase, private toastr: ToastrService,
                public shared: SharedService, private _crudService: CrudService) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setLocale.bind(this));
        } else {
            console.log('Geolocation not supported');
        }
    }

    setLocale(position: any): void {
        this.userLat = position.coords.latitude;
        this.userLng = position.coords.longitude;
    }

    ngOnInit() {
        this.roleUser = this.shared.getUserRole();
        this.getChurches();
        this.getStatus();
        this.getTecnicos();
    }

    showModal(e?) {
        if (e) {
            this.ordemServico = e;
            this.isEditing = true;
            // this.ordemServico.quilometros = Math.round(this.getDistance([e.ccbinfo.lat, e.ccbinfo.lng], [this.userLat, this.userLng]) * 2);
        } else {
            this.ordemServico = new OrdemServico;
            this.isEditing = false;
            const x = new Date();
            this.ordemServico.id = `${x.getDate()}${x.getMonth() + 1}${x.getUTCFullYear()}` +
            `${x.getHours()}${x.getMinutes()}${x.getSeconds()}${x.getMilliseconds()}`;
            this.ordemServico.dataCadastro = `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}`;
            this.ordemServico.numeroOS = this.ordemServico.id;
        }
        this.createModal.show();
    }

    dismissModal() {
        this.createModal.hide();
    }

    onSubmit(form: NgForm) {
        let ccbinfo = this.churches.filter(id => id.id === form.value.ccb);
        let t1 = this.tecnicos.filter(id => id.id === form.value.tecnico1);
        let t2 = this.tecnicos.filter(id => id.id === form.value.tecnico2);

        // const valorHoraTecnico = 0;
        // const horaEntrada = moment( new Date(`05/05/2019 ${form.value.horaEntrada}`));
        // const horaSaida = moment(`05/05/2019 ${form.value.horaSaida}`);
        // const duration = moment.duration(horaSaida.diff(horaEntrada)).asHours();

        // form.value['valorTotal'] = ((
        //     (form.value.quilometros / form.value.consumoMedio) *
        //     form.value.valorGas) + (valorHoraTecnico * duration
        // )).toFixed(3);

        if (ccbinfo.length) {
            ccbinfo = ccbinfo[0];
            this.ordemServico['ccbinfo'] = (ccbinfo);
        }
        if (t1.length) {
            t1 = {'nome': t1[0].nome, 'celular': t1[0].celular ? t1[0].celular : '', 'email': t1[0].email ? t1[0].email : ''};
            this.ordemServico['tecnico1Info'] = t1;
        }
        if (t2.length) {
            t2 = {'nome': t2[0].nome, 'celular': t2[0].celular ? t2[0].celular : '', 'email': t2[0].email ? t2[0].email : ''};
            this.ordemServico['tecnico2Info'] = t2;
        }

        this.angularFire.list(`ordemServico/`).set(`${this.ordemServico.id}`, this.ordemServico)
            .then((t: any) => {
                const ordemServico = { osNumber: this.ordemServico.numeroOS, status: this.ordemServico.status };
                this.angularFire.list(`igrejas/`).set(`${form.value.ccb}`, {...ccbinfo, ordemServico })
                    .then()
                    .catch((error: any) => {
                        this.toastr.error('Ocorreu um erro ao adicionar a ordem à igreja!', 'Erro!');
                    });
                this.createModal.hide();
                this.ordemServico = new OrdemServico;
                this.toastr.success('Status salvo com sucesso!', 'Sucesso!');
                if (!this.isEditing) {
                    this.sendEmail(t1, t2);
                }
            })
            .catch((error) => {
                this.toastr.error('Ocorreu um erro ao adicionar a ordem de serviço!', 'Erro!');
                console.log(`Error: ${error}`);
            });
    }

    private rad(x) {
        return x * Math.PI / 180;
    }

    private getDistance(p1: number[], p2: number[]) {
        // Earth’s mean radius in meter
        const R = 6378137;
        const dLat = this.rad(p2[0] - p1[0]);
        const dLong = this.rad(p2[1] - p1[1]);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1[0])) * Math.cos(this.rad(p2[0])) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        return d / 1000; // returns the distance in kilometer
    }

    private getChurches() {
        this.angularFire.list(`regioes/${localStorage.getItem('userCity')}/igrejas`).valueChanges().subscribe(
            data => this.churches = data
        );
    }

    private getStatus() {
        this.angularFire.list(`status`).valueChanges().subscribe(
            data => this.allStatus = data
        );
    }

    private getTecnicos() {
        this.angularFire.list(`regioes/${localStorage.getItem('userCity')}/tecnicos`).valueChanges().subscribe(
            data => this.tecnicos = data
        );
    }

    private sendEmail(t1: Tecnico, t2?: Tecnico): void {
        const emailForm = {
            recipient: `${t1.email}${t2 ? `, ${t2.email}` : ''}`,
            subject: 'Você foi adicionado em uma OS! - SGO'
        };

        this.subscription = this._crudService.saveOption(emailForm, 'send-email-order').subscribe(
            success => console.log(success),
            err => console.log(err)
        );
    }

}
