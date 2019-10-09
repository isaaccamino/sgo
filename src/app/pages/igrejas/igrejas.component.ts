import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IgrejaModalComponent } from './igreja-modal/igreja-modal.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';

@Component({
    selector: 'app-igrejas',
    templateUrl: './igrejas.component.html',
    styleUrls: ['./igrejas.component.scss'],
    providers: [AngularFireDatabase, AngularFireAuth],
})
export class IgrejasComponent implements OnInit {
    @ViewChild(IgrejaModalComponent) modalComponent: IgrejaModalComponent;
    @ViewChild(DeleteModalComponent) deleteModal: DeleteModalComponent;

    public igrejas;
    public isLoaded = true;
    public filter = '';
    public page = 1;
    public key = 'bairro';
    public reverse = false;

    constructor(private angularFire: AngularFireDatabase, private afAuth: AngularFireAuth) {
    }

    ngOnInit() {
        this.getIgrejas();
    }

    showModal(e?) {
        this.modalComponent.showModal(e);
    }

    delete(e) {
        this.deleteModal.showModal(e.id, e.bairro, 'igrejas');
    }

    getIgrejas() {
        this.isLoaded = false;
        this.angularFire.list(`regioes/${localStorage.getItem('userCity')}/igrejas`).valueChanges().subscribe(
            data => {
                this.igrejas = data;
                this.isLoaded = true;
            }
        );
    }

    sort(key: string) {
        this.key = key;
        this.reverse = !this.reverse;
    }

}
