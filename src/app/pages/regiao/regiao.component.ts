import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RegiaoModalComponent } from './regiao-modal/regiao-modal.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { Regiao } from './regiao';

@Component({
    selector: 'app-regiao',
    templateUrl: './regiao.component.html',
    styleUrls: ['./regiao.component.scss'],
    providers: [AngularFireDatabase, AngularFireAuth],
})
export class RegiaoComponent implements OnInit {
    @ViewChild(RegiaoModalComponent) modalComponent: RegiaoModalComponent;
    @ViewChild(DeleteModalComponent) deleteModal: DeleteModalComponent;

    public regioes: Regiao[];
    public administradores: any[];

    public isLoaded = true;
    public filter = '';
    public page = 1;
    public key = 'nome';
    public reverse = false;

    constructor(private angularFire: AngularFireDatabase) {
    }

    ngOnInit() {
        this.getRegioes();
    }

    showModal(e?: Regiao) {
        this.modalComponent.showModal(e);
    }

    delete(e: Regiao) {
        console.log(e)
        this.deleteModal.showModal(e.id, e.nome, 'regioes');
    }

    getRegioes() {
        this.isLoaded = false;
        this.angularFire.list(`cidades`).valueChanges().subscribe(
            (data: Regiao[]) => {
                this.regioes = data;
                console.log(data)
                this.isLoaded = true;
            }
        );
    }

    sort(key: string) {
        this.key = key;
        this.reverse = !this.reverse;
    }
}
