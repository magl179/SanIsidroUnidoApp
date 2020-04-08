declare var moment: any;

  //Obtener la fecha formateada con MomentJS
export const getBeatifulDate = (stringDate: string) => {
    moment.locale('es');
    let beatifulDate = null;
    if (moment(stringDate).isValid()) {
        // Fecha Pasada, Fecha Actual
        const currentDate = moment(new Date());
        const lastDate = moment(new Date(stringDate));
        //Diferencia entre Fechas
        const diffDays = currentDate.diff(lastDate, 'days');
        // Formatear Fecha
        if (diffDays <= 8) {
            beatifulDate = lastDate.fromNow();
        } else if (currentDate.year() === lastDate.year()) {
            beatifulDate = lastDate.format('D MMMM');
        } else {
            beatifulDate = lastDate.format('LL');
        }
    } else {
        throw new Error(`Fecha Inválida-${stringDate}`);
    }
    return beatifulDate;
}

 //Obtener la fecha junta
export const getFullDate = (date: any, time: any) => {
    const fulldate = `${date} ${time}`;
    return fulldate;
}