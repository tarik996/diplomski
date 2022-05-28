import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from 'axios';

async function exportPDF(tableName, allUsers, tableHeaders, userJSON) {
    const unit = "pt";
    const size = "A4"; 
    const orientation = "landscape"; 
    const doc = new jsPDF(orientation, unit, size);

    const AmiriRegular = await axios.get('https://tarik-diplomski.herokuapp.com/api/fonts/getAmiriFont');
    
    doc.addFileToVFS("Amiri-Regular.ttf", AmiriRegular.data.encode);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");
    doc.setFontSize(15);

    const title = tableName;
    const headers = tableHeaders;

    const data = allUsers.map(user => { 
        return (
            userJSON.map(i => {
                return [user[i]];
        }));
    });

    let content = {
        startY: 50,
        head: headers,
        body: data,
        headStyles: {
            font: "Amiri"
        },
        bodyStyles: {
            font: "Amiri"
        }
    };
    
    doc.text(title, 40, 40);
    doc.autoTable(content);
    
    doc.save(tableName + '.pdf');
}

export { exportPDF };