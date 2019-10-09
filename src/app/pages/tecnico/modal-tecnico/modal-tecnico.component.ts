import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from '../tecnico';

@Component({
    selector: 'app-modal-tecnico',
    templateUrl: './modal-tecnico.component.html',
    styleUrls: ['./modal-tecnico.component.scss']
})
export class ModalTecnicoComponent implements OnInit {

    @ViewChild('createModal') createModal: ModalDirective;
    public tecnico = new Tecnico;
    public isEditing;

    public states = [
        { value: '', estado: 'Selecione um estado' },
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

    ngOnInit() {
    }

    showModal(e?) {
        if (e) {
            this.tecnico = e;
            this.isEditing = true;
        } else {
            this.tecnico = new Tecnico;
            const x = new Date();
            this.tecnico.id = `${x.getDate()}${x.getMonth() + 1}${x.getUTCFullYear()}` +
                `${x.getHours()}${x.getMinutes()}${x.getSeconds()}${x.getMilliseconds()}`;
            this.tecnico.uf = this.states[0].value;
            this.isEditing = false;
        }
        this.createModal.show();
    }

    dismissModal() {
        this.createModal.hide();
        this.tecnico = new Tecnico;
    }

    onSubmit(form: NgForm) {
        form.value.complemento = form.value.complemento ? form.value.complemento : '';
        this.angularFire.list(`regioes/${localStorage.getItem('userCity')}/tecnicos/`).set(`${this.tecnico.id}`, form.value).then((t: any) => {
            this.createModal.hide();
            this.tecnico = new Tecnico;
            this.toastr.success('Técnico salvo com sucesso!', 'Sucesso!');
        });
    }

}
