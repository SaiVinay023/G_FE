export function formatLicensePlate(licensePlateNumber: string | null, countryCode: string | null) {
  if (!licensePlateNumber) return licensePlateNumber;

  const plateNum = (licensePlateNumber ?? '').trim().replace(/\s+/g, '');

  if (plateNum.length > 10) {
    return plateNum.toUpperCase();
  }

  const groups = plateNum.match(/[A-Za-z]+|\d+/g);

  if (!groups) {
    return plateNum.toUpperCase();
  }

  let formattedPlate = groups.reduce((acc, group, index) => {
    if (index === 0) {
      return group;
    }

    const prevGroup = groups[index - 1];
    if ((isNaN(Number(prevGroup)) && !isNaN(Number(group))) || (!isNaN(Number(prevGroup)) && isNaN(Number(group)))) {
      return `${acc} ${group}`;
    } else {
      return `${acc}${group}`;
    }
  }, '');

  if (formattedPlate === plateNum) {
    switch (countryCode) {
      case 'NL':
        formattedPlate = plateNum.slice(0, 2) + '-' + plateNum.slice(2, 5) + '-' + plateNum.slice(5, plateNum.length);
        break;
      case 'P':
        formattedPlate = plateNum.slice(0, 3) + '-' + plateNum.slice(3, 5) + '-' + plateNum.slice(5, plateNum.length);
        break;
      case 'F':
        formattedPlate = plateNum.slice(0, 2) + '-' + plateNum.slice(2, 5) + '-' + plateNum.slice(5, plateNum.length);
        break;
      case 'I':
        formattedPlate = plateNum.slice(0, 2) + ' ' + plateNum.slice(2, plateNum.length);
        break;
      case 'ES':
        formattedPlate = plateNum.slice(0, 4) + ' ' + plateNum.slice(4, plateNum.length);
        break;

      case 'D':
        formattedPlate = `${plateNum.slice(0, 1)} ${plateNum.slice(1, 3)} ${plateNum.slice(3, plateNum.length)}`;
        break;

      default:
        formattedPlate =
          plateNum?.slice?.(0, 2) + ' ' + plateNum?.slice?.(2, 4) + ' ' + plateNum?.slice?.(4, plateNum.length);
        break;
    }
  }

  return formattedPlate.toUpperCase();
}
