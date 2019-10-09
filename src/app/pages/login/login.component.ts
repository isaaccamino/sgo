import { AngularFireDatabase } from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [AngularFireAuth, AngularFireDatabase],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

    public isLoading = false;

    constructor(private afAuth: AngularFireAuth, private angularFire: AngularFireDatabase,
                private router: Router, private toastr: ToastrService) { }

    ngOnInit() {
    }

    onSubmit(f: NgForm) {
        this.isLoading = true;
        if (!f.valid) {
            this.toastr.error('Falha ao realizar login', 'Erro!');
            this.isLoading = false;
            return;
        }
        this.afAuth.auth.signInWithEmailAndPassword(f.controls.email.value, f.controls.senha.value)
            .then(ok => {
                this.angularFire.list(`usuarios/${ok.user.uid}`).valueChanges().subscribe(
                    (data: any) => {
                        localStorage.setItem('usuario', window.btoa(data));
                        localStorage.setItem('userCity', data[3]);
                        this.toastr.success(`Seja bem-vindo ao sistema, ${data[2]}`, 'Bem-vindo!');
                        this.isLoading = false;
                        this.router.navigate(['/mapa'])
                        data[4] === 'MINISTERIO' ? this.router.navigate(['/mapa']) : this.router.navigate(['/agenda']);
                    }
                );
            })
            .catch(error => {
                if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email') {
                    this.toastr.error('Usuário ou senha inválidos', 'Erro ao acessar!');
                } else if (error.code === 'auth/user-not-found') {
                    this.toastr.error('E-mail inválido', 'Erro ao acessar!');
                } else {
                    this.toastr.error('Ocorreu um erro ao acessar a aplicação', 'Erro ao acessar!');
                }
                this.isLoading = false;
            });

        f.controls.email.setValue('');
        f.controls.senha.setValue('');
    }

}
