import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';
import { Regiao } from '../regiao';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-regiao-modal',
    templateUrl: './regiao-modal.component.html',
    styleUrls: ['./regiao-modal.component.scss']
})

// TODO
// Alterar REGIAO para CIDADE
// uma igreja é RESPONSABILIDADE de uma cidade
export class RegiaoModalComponent implements OnInit {
    @ViewChild('createModal') createModal: ModalDirective;

    public regiao: Regiao;
    constructor(private angularFire: AngularFireDatabase, private toastr: ToastrService) { }

    ngOnInit() {
        this.regiao = new Regiao;
    }


    showModal(e?: Regiao): void {
        if (e) {
            this.regiao = e;
        } else {
            this.regiao = new Regiao;
            const x = new Date();
            this.regiao.id = `${x.getDate()}${x.getMonth() + 1}${x.getUTCFullYear()}` +
                `${x.getHours()}${x.getMinutes()}${x.getSeconds()}${x.getMilliseconds()}`;
        }
        this.createModal.show();
    }

    dismissModal(): void {
        this.regiao = new Regiao;
        this.createModal.hide();
    }

    onSubmit(form: NgForm): void {
        this.angularFire.list(`regioes/`).set(`${this.regiao.id}`, form.value).then((t: any) => {
            this.createModal.hide();
            this.regiao = new Regiao;
            this.toastr.success('Regiao salva com sucesso!', 'Sucesso!');
        }).catch((reason: any) => {
            this.toastr.error(`Ops! Algo de inesperado ocorreu!`, 'Erro!');
            console.error(reason);
        });
    }

}
