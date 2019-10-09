import { AngularFireAuth } from 'angularfire2/auth';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../Usuario';
import { ToastrService } from 'ngx-toastr';
import { Regiao } from '../../regiao/regiao';

@Component({
    selector: 'app-modal-usuarios',
    templateUrl: './modal-usuarios.component.html',
    styleUrls: ['./modal-usuarios.component.scss'],
    providers: [AngularFireAuth]
})
export class ModalUsuariosComponent implements OnInit {

    @ViewChild('createModal') createModal: ModalDirective;
    public usuario = new Usuario;
    public regioes: any[];
    public isEditing = false;
    public isLoading: boolean;
    private DEFAULT_PASSWORD = 'ccbnovousuario';

    constructor(private afAuth: AngularFireAuth, private toastr: ToastrService, private angularFire: AngularFireDatabase) { }

    ngOnInit() {
        this.getRegioes();
        this.usuario = new Usuario;
    }

    getRegioes() {
        this.isLoading = true;
        this.angularFire.list(`cidades`).valueChanges().subscribe(
            (data: Regiao[]) => {
                this.regioes = data;
                this.isLoading = false;
            }
        );
    }

    showModal(e?) {
        if (e) {
            this.usuario = e;
            this.isEditing = true;
        } else {
            this.isEditing = false;
            this.usuario = new Usuario;
        }
        this.createModal.show();
    }

    dismissModal() {
        this.createModal.hide();
    }

    onSubmit(form: NgForm) {
        if (this.isEditing) {
            this.angularFire.list(`usuarios/`).set(`${this.usuario.id}`, form.value).then((t: any) => {
                this.createModal.hide();
                this.toastr.success('Usuário editado com sucesso!', 'Sucesso!');
            });
            this.usuario = new Usuario;
        } else {
            this.afAuth.auth.createUserWithEmailAndPassword(
                form.controls.email.value,
                this.DEFAULT_PASSWORD
            ).then((ok: any) => {
                this.usuario.id = ok.user.uid;
                form.value.id = ok.user.uid;
                this.angularFire.list(`usuarios/`).set(`${this.usuario.id}`, form.value).then((t: any) => {
                    this.createModal.hide();
                    this.toastr.success('Usuário cadastrado com sucesso!', 'Sucesso!');
                });
                this.usuario = new Usuario;
            });
        }
    }

}
