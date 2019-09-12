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
            title: 'Redes Sociales Asociadas',
            description: 'Las Redes Sociales Asociadas te permiten que puedas iniciar sesión por medio de tu cuenta de Facebook o Google, si deseas desconectar una cuenta social asegurate primero de tener una contraseña activa, caso contrario cambia tu contraseña para que puedas iniciar sesión por medio de un formulario',
            icon: 'help-circle-outline',
            open: true
        },
        {
            title: 'Dispositivos Asociados',
            description: ' Los dispositivos asociados se registran cuando inicias sesión para permitir que recibas notificaciones en tu celular, si desconectas un dispositivo ya no podrás recibir notificaciones en dicho dispositivo',
            icon: 'help-circle-outline',
            open: false
        },
        {
            title: 'No puedo visualizar las opciones en la aplicación',
            description: 'Si observas algún problema con la aplicación, cierra y vuelve a abrir la aplicación o cierra sesión y vuelve a iniciar sesión para comprobar si el problema persiste',
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
