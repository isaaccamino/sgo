import { ModalUsuariosComponent } from './modal-usuarios/modal-usuarios.component';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [AngularFireAuth, AngularFireDatabase]
})
export class UsuariosComponent implements OnInit {

  @ViewChild(ModalUsuariosComponent) modalComponent: ModalUsuariosComponent;
    public usuarios;
    public isLoaded = true;

    constructor(private angularFire: AngularFireDatabase, private afAuth: AngularFireAuth, private toastr: ToastrService) {
    }

    ngOnInit() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.getUsuarios();
            }
        });
    }

    showModal(e?) {
        this.modalComponent.showModal(e);
    }

    getUsuarios() {
        this.isLoaded = false;
        this.angularFire.list(`usuarios`).valueChanges().subscribe(
            data => {
                this.usuarios = data;
                this.isLoaded = true;
            }
        );
    }

}
