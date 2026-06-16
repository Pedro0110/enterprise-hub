import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../../shared/services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let message = 'Erro ao processar a requisição';
    console.error(`[HTTP Error ${error.status}] ${error.url}`, error);

    if (error.status === 400) {
      message = error.error?.message || 'Validação falhou. Verifique os dados informados.';
    } else if (error.status === 404) {
      if (error.url?.includes('/cep/')) {
        message = 'CEP não encontrado. Verifique o CEP informado.';
      } else if (error.url?.includes('/companies/')) {
        message = 'Empresa não encontrada.';
      } else if (error.url?.includes('/suppliers/')) {
        message = 'Fornecedor não encontrado.';
      } else {
        message = 'Recurso não encontrado.';
      }
    } else if (error.status === 409) {
      if (error.url?.includes('/companies')) {
        if (error.error?.message?.includes('fornecedores')) {
          message = 'Não é possível deletar a empresa pois possui fornecedores associados.';
        } else {
          message = 'CNPJ já registrado no sistema.';
        }
      } else if (error.url?.includes('/suppliers')) {
        if (error.error?.message?.includes('empresas')) {
          message = 'Não é possível deletar o fornecedor pois possui empresas associadas.';
        } else {
          message = 'CPF/CNPJ já registrado no sistema.';
        }
      } else {
        message = error.error?.message || 'Recurso já existe no sistema.';
      }
    } else if (error.status === 422) {
      // Unprocessable Entity
      message = error.error?.message || 'Fornecedor menor de idade não pode ser associado a empresa do Paraná.';
    } else if (error.status === 503) {
      // Service Unavailable
      if (error.url?.includes('/cep/')) {
        message = 'Serviço de CEP indisponível no momento. Tente novamente mais tarde.';
      } else {
        message = 'Serviço indisponível no momento. Tente novamente mais tarde.';
      }
    } else if (error.status === 0) {
      message = 'Erro de conectividade. Verifique se o backend está rodando em http://localhost:8080';
    } else if (error.status >= 500) {
      const serverMessage = error.error?.message || error.error?.error || error.statusText;
      message = serverMessage
        ? `Erro no servidor: ${serverMessage}`
        : 'Erro interno do servidor (500). Verifique os logs do backend.';
    }

    console.error('Error message to user:', message);
    this.toastService.error(message);
  }
}
