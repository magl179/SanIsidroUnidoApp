import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frequent-questions',
  templateUrl: './frequent-questions.page.html',
  styleUrls: ['./frequent-questions.page.scss'],
})
export class FrequentQuestionsPage implements OnInit {

    automaticClose = true;
    frequentQuestions = [
        {
            title: '¿Qué son las redes sociales asociadas?',
            description: 'Las Redes Sociales Asociadas te permiten que puedas iniciar sesión por medio de tu cuenta de Facebook o Google, si deseas desconectar una cuenta social asegurate primero de tener una contraseña activa, caso contrario cambia tu contraseña para que puedas iniciar sesión por medio de un formulario',
            icon: 'help-circle-outline',
            open: true
        },
        {
            title: '¿Qué son los dispositivos asociados?',
            description: ' Los dispositivos asociados se registran cuando inicias sesión para permitir que recibas notificaciones en tu celular, si desconectas un dispositivo ya no podrás recibir notificaciones en dicho dispositivo',
            icon: 'help-circle-outline',
            open: false
        },
        {
            title: '¿Que hacer si no puedo visualizar las opciones en la aplicación?',
            description: 'Si observas algún problema con la aplicación, verifica tu conexión a Internet, si eso no lo resuelve, cierra y vuelve a abrir la aplicación o inicia sesión nuevamente, caso contrario puedes dejar un comentario en las tiendas de aplicaciones para poder conocer el problema y resolverlo lo más rápido posible',
            icon: 'git-compare',
            open: false
        }
    ];

  constructor() { }

  ngOnInit() {
  }
    
  toggleSection(index, hasChild) {
    this.frequentQuestions[index].open = !this.frequentQuestions[index].open;
    if (this.automaticClose && this.frequentQuestions[index].open) {
        this.frequentQuestions
            .filter((item, itemIndex) => {
                if (hasChild) {
                    return itemIndex !== index;
                }
            })
            .map(item => item.open = false);
    }
}

}
