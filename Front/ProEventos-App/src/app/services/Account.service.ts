import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/models/Identity/User';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { environment } from '@environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AccountService {
  // Cria um ReplaySubject que armazenará o usuário autenticado.
  // O número 1 indica que ele sempre guarda o último valor emitido.
  // Assim, qualquer componente que se inscrever posteriormente receberá
  // imediatamente o usuário atual, mesmo que o login tenha ocorrido antes.
  private currentUserSource = new ReplaySubject<User>(1);

  // Expõe o ReplaySubject apenas como Observable.
  // Isso permite que outros componentes apenas recebam as informações
  // do usuário, sem poder alterar seu valor diretamente.
  // Somente este serviço pode emitir novos valores utilizando next().
  public currentUser$ = this.currentUserSource.asObservable();

  baseUrl = environment.apiURL + 'api/account/';
  constructor(private http: HttpClient) {}

  public login(model: any): Observable<void> {
    return this.http.post<User>(this.baseUrl + 'login', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if (user) {
          // dependendo da aplicação, o nome da chave pode mudar
          // ex: vários usuários no mesmo computador / navegador vão precisar de chaves diferentes para não puxar as info dos outros
          this.setCurrentUser(user);
        }
      }),
    );
  }

  public logout(): void {
    // Remove os dados do usuário armazenados localmente.
    localStorage.removeItem('user');

    // Emite um valor nulo para informar a todos os componentes
    // inscritos que não existe mais um usuário autenticado.
    this.currentUserSource.next(null);

    // Finaliza o Observable, encerrando todas as inscrições
    // (subscriptions) e impedindo novas emissões de valores.
    this.currentUserSource.complete();
  }

  public setCurrentUser(user: User): void {
    // Armazena o usuário no Local Storage para manter o login
    // mesmo após atualizar ou fechar e reabrir a página.
    localStorage.setItem('user', JSON.stringify(user));

    // Emite o usuário autenticado para todos os componentes
    // inscritos em currentUser$, notificando imediatamente
    // que houve alteração no estado de autenticação.
    this.currentUserSource.next(user);
  }

  public register(model: User): Observable<void> {
    return this.http.post<User>(this.baseUrl + 'register', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      }),
    );
  };

  getUser() : Observable<UserUpdate> {
    return this.http.get<UserUpdate>(this.baseUrl + 'getUser').pipe(take(1));
  };

  updateUser(model : UserUpdate) : Observable<void>{
    return this.http.put<UserUpdate>(this.baseUrl + 'updateUser',model).pipe(take(1), map((user : UserUpdate) => {
      this.setCurrentUser(user);
    }));
  };
}
