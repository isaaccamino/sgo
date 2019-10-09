import { AngularFireDatabase } from 'angularfire2/database';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Data } from './data';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-delete-modal',
    templateUrl: './delete-modal.component.html',
    styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

    @ViewChild('createModal') createModal: ModalDirective;
    public data = new Data;

    constructor(private angularFire: AngularFireDatabase, public db: AngularFirestore, private toastr: ToastrService) { }

    ngOnInit() {
    }

    /**
     * 
     * @param id String | Number ID of the element
     * @param name String | Number Name of the element
     * @param route String Name of the route to delete
     * @param optional Any Optional parameter
     */
    showModal(id: string | number, name: string, route: string, optional?: any) {
        this.data.id = id;
        this.data.nome = name;
        this.data.route = route;
        this.data.optional = optional ? optional : null;
        this.createModal.show();
    }

    dismissModal() {
        this.createModal.hide();
    }

    remove() {
        this.angularFire.list(`${this.data.route}`).remove(`${this.data.id}`).then(
            () => {
                this.createModal.hide();
                this.toastr.success(`Removido com sucesso!`, 'Sucesso!');
                if (this.data.route === 'ordemServico') {
                    this.data.optional.ccbinfo.ordemServico.osNumber = '';
                    this.data.optional.ccbinfo.ordemServico.status = '';
                    this.angularFire.list(`igrejas/`).set(`${this.data.optional.ccbinfo.id}`, this.data.optional.ccbinfo)
                    .then()
                    .catch((error: any) => {
                        this.toastr.error('Ocorreu um erro ao adicionar a ordem à igreja!', 'Erro!');
                    });
                }
            },
            err => {
                this.toastr.error(`Ocorreu um erro ao remover ${this.data.route}!`, 'Erro!');
                console.log(err);
            }
        );
    }
}
