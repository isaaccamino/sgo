import { DeleteModalComponent } from './../../shared/components/delete-modal/delete-modal.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdemServicoModalComponent } from './ordem-servico-modal/ordem-servico-modal.component';
import { OrdemServicoModalViewComponent } from './ordem-servico-modal-view/ordem-servico-modal-view.component';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    selector: 'app-ordem-servico',
    templateUrl: './ordem-servico.component.html',
    styleUrls: ['./ordem-servico.component.scss'],
    providers: [AngularFireDatabase, AngularFireAuth, SharedService]
})
export class OrdemServicoComponent implements OnInit {

    @ViewChild(OrdemServicoModalComponent) modalComponent: OrdemServicoModalComponent;
    @ViewChild(DeleteModalComponent) deleteModal: DeleteModalComponent;
    @ViewChild(OrdemServicoModalViewComponent) viewModal: OrdemServicoModalViewComponent;
    public orders = [];
    public isLoaded = true;
    public filter: string;
    public page = 1;
    public key = 'igreja';
    public reverse = false;

    constructor(private angularFire: AngularFireDatabase, public shared: SharedService) {
    }

    ngOnInit() {
        this.getOrdemServico();
    }

    showModal(e?) {
        this.modalComponent.showModal(e);
    }

    viewModalOS(e) {
        this.viewModal.showModal(e);
    }

    delete(e) {
        this.deleteModal.showModal(e.id, `Ordem de Serviço "${e.numeroOS}" da igreja ${e.ccbinfo.bairro}`, 'ordemServico', e);
    }

    sort(key: string) {
        this.key = key;
        this.reverse = !this.reverse;
    }

    getOrdemServico() {
        this.isLoaded = false;
        this.angularFire.list(`regioes/${localStorage.getItem('userCity')}/ordemServico`).valueChanges().subscribe(
            (data: any) => {
                const user = atob(localStorage.getItem('usuario')).split(',');
                if (user[4] === 'ADMIN' || user[4] === 'ADMINGERAL') {
                    this.orders = data;
                } else {
                    data.forEach(ordem => {
                        if (!ordem.tecnico1Info && !ordem.tecnico2Info) {
                            return;
                        }
                        if (ordem.tecnico1Info !== undefined && ordem.tecnico1Info.nome === user[2]) {
                            this.orders.push(ordem);
                        }
                        if (ordem.tecnico2Info !== undefined && ordem.tecnico2Info.nome === user[2]) {
                            this.orders.push(ordem);
                        }
                    });
                }
                this.orders.forEach(element => element['ccbName'] = element.ccbinfo['bairro'] );
                this.isLoaded = true;
            }
        );
    }

    getClass(status) {
        switch (status) {
            case 'Agendar':
                return 'agendar'
                break;
            case 'Agendado':
                return 'agendado'
                break;
            case 'URGENTE':
                return 'urgente'
                break;
            case 'Não solucionado':
                return 'nao-solucionado'
                break;
            case 'Contatar TOKAI':
                return 'contatar'
                break;
            default:
                return 'concluido'
                break;
        }
    }
}
