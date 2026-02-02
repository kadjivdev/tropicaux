import "./../../../public/fichiers/base.css";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CIcon from '@coreui/icons-react';
import { cibAlipay, cibAsana, cibCashapp, cibCcAmazonPay, cilBlur, cilDollar, cilEuro, cilMoney, cibTrainerroad } from "@coreui/icons";
import { Head } from '@inertiajs/react';
import { cilWallet, cilSmilePlus, cilPeople } from "@coreui/icons";
import { useEffect, useRef } from 'react';
import Chart from "chart.js/auto";

export default function Dashboard({ financementsAmount, fondSuperviseursAmount, depensesSuperviseursAmount, ventesAmount, ventes, chargements }) {
    const chargementChartRef = useRef(null);
    const venteChartRef = useRef(null);

    useEffect(() => {
        if (!chargementChartRef.current || !venteChartRef.current) return;

        // 🔹 Chargements Chat
        const chargementChart = new Chart(chargementChartRef.current, {
            type: "bar",
            data: {
                labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
                datasets: [
                    {
                        label: "Nombre (mensuel)",
                        data: chargements.data,
                        backgroundColor: "#2a7348",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // 🔹 important si tu veux contrôler la taille
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });

        // 🔹 Ventes Chat
        const venteChart = new Chart(venteChartRef.current, {
            type: "bar",
            data: {
                labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
                datasets: [
                    {
                        label: "Nombre (mensuel)",
                        data: ventes.data,
                        backgroundColor: "#2a7348",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // 🔹 important si tu veux contrôler la taille
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });

        // 🔹 Nettoyer les instances pour éviter les doublons
        return () => {
            chargementChart.destroy();
            venteChart.destroy();
        };
    }, [ventes, chargements]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-yellow' icon={cilBlur} />  Bienvenu sur <strong className="badge bg-light border rounded"> <em className="text-warning">TROPI </em>  <span className="text-success">' Care</span></strong>
                </h2>
            }
        >
            <Head title="Dashboard" />

            {/*  */}
            <div className="p-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Totaux */}
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-6">
                                <div
                                    uk-scrollspy="cls: uk-animation-slide-top"
                                    className="shadow bg-dark border p-4 rounded-md border-sky-500 flex flex-col items-center justify-center">
                                    <p className="text-2xl mt-2 text-cursive font-bold"><strong className="text-danger"> {financementsAmount < 10 ? '0' + financementsAmount : financementsAmount} </strong> </p>
                                    <h2 className="text-xl text-gray-500"> <CIcon className="nav-icon text-success" icon={cibAlipay} /> Financements </h2>
                                </div>
                                <div
                                    uk-scrollspy="cls: uk-animation-slide-top"
                                    className="shadow bg-dark border p-4 rounded-md border-sky-500 flex flex-col items-center justify-center">
                                    <p className="text-2xl mt-2 text-cursive font-bold"> <strong className="text-success"> {fondSuperviseursAmount < 10 ? '0' + fondSuperviseursAmount : fondSuperviseursAmount} </strong>  </p>
                                    <h2 className="text-xl text-gray-500"> <CIcon className="nav-icon text-success" icon={cibCcAmazonPay} /> Fonds superviseurs </h2>
                                </div>
                                <div
                                    uk-scrollspy="cls: uk-animation-slide-top"
                                    className="shadow bg-dark border p-4 rounded-md border-sky-500 flex flex-col items-center justify-center">
                                    <p className="text-2xl mt-2 text-cursive font-bold"><strong className="text-danger"> {depensesSuperviseursAmount < 10 ? '0' + depensesSuperviseursAmount : depensesSuperviseursAmount} </strong></p>
                                    <h2 className="text-xl text-gray-500"> <CIcon className="nav-icon text-success" icon={cibCashapp} /> Les Dépenses </h2>
                                </div>
                                <div
                                    uk-scrollspy="cls: uk-animation-slide-top"
                                    className="shadow bg-dark border p-4 rounded-md border-sky-500 flex flex-col items-center justify-center">
                                    <p className="text-2xl mt-2 text-cursive font-bold"><strong className="text-success"> {ventesAmount < 10 ? '0' + ventesAmount : ventesAmount} </strong></p>
                                    <h2 className="text-xl text-gray-500"> <CIcon className="nav-icon text-success" icon={cibAsana} /> Ventes </h2>
                                </div>
                            </div>

                            <br /><br />
                            {/* Graphics */}
                            <div className="grid grid-cols-2 gap-4 bg-light rounded shadow-sm p-2">
                                <div className="h-80"> {/* 🔹 hauteur fixée */}
                                    <h3 className="text-center mb-3 font-semibold  text-xl text-gray-500"><CIcon className="nav-icon text-success" icon={cibTrainerroad} /> Chargements enregistrés par mois </h3>
                                    <canvas ref={chargementChartRef}></canvas>
                                </div>
                                <div className="h-80">
                                    <h3 className="text-center mb-3 font-semibold  text-xl text-gray-500"><CIcon className="nav-icon text-success" icon={cibAsana} /> Ventes enregistrées par jours </h3>
                                    <canvas ref={venteChartRef}></canvas>
                                </div>
                            </div>

                            <br /><br /><br />
                            {/* Details */}
                            <div className="mt-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold  text-xl text-gray-500"><CIcon className="nav-icon text-success" icon={cibTrainerroad} /> Les Chargements </h3>
                                        <table id="" className="table-auto border-collapse border-b border-slate-400 mt-4 w-full">
                                            <thead>
                                                <tr>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Numero </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Produit </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Chauffeur </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Superviseur</th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Inseré le</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    chargements.data.map((chargement, index) => (
                                                        <tr key={chargement.id}>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{chargement.numero}</span></td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{chargement.produit?.libelle}</span></td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{chargement.chauffeur?.raison_sociale}</span> </td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{chargement.superviseur?.raison_sociale}</span> </td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{chargement.created_at}</span> </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold  text-xl text-gray-500"><CIcon className="nav-icon text-success" icon={cibAsana} /> Ventes </h3>
                                        <table id="" className="table-auto border-collapse border-b border-slate-400 mt-4 w-full">
                                            <thead>
                                                <tr>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Partenaire </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Prix </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Poids </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Montant total </th>
                                                    <th className="border-b border-slate-300 p-2 text-left bg-slate-50"> Inseré le</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    ventes.data.map((vente, index) => (
                                                        <tr key={vente.id}>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{vente.partenaire?.raison_sociale}</span></td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{vente.prix}</span></td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{vente.poids}</span> </td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{vente.montant_total}</span> </td>
                                                            <td className="border-b border-slate-300 p-2"> <span className="badge bg-light text-dark border rounded">{vente.created_at}</span> </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
