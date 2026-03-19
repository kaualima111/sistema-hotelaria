export const cpfMask = value => {    
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
}

export const cepMask = value => {    
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
}

export const telefoneMask = value => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1')
}

export const moneyMask = value => {
    if (!value) return 'R$ 0,00';
    const numeric = value.replace(/\D/g, '');
    const formatted = (parseInt(numeric) / 100).toFixed(2);
    return `R$ ${formatted.replace('.', ',')}`;
}