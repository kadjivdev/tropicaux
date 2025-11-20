import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilList, cibAddthis } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'
import { useState } from 'react';

export default function Update({ backfinancement,financements }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    console.log("Le retour de financement concerné :",backfinancement)

    const {
        data,
        setData,
        errors,
        patch,
        processing,
    } = useForm({
        financement_id: backfinancement.financement_id || "",
        montant: backfinancement.financement_montant_r || "",
    });

    const [maxAmount, setMaxAmount] = useState(backfinancement.financement_montant_r)

    // Fields handling
    const changeFinancement = (option) => {
        setData('financement_id', option.value)

        const selectedFinancement = financements.data.find((s) => s.id === option.value);
        console.log("Financement sélectionné :", selectedFinancement);

        setMaxAmount(selectedFinancement.montant_r)
        setData("montant", selectedFinancement.montant_r)
    }

    // Change Amount
    const changeAmount = (e) => {
        e.preventDefault()
        console.log("Le montant saisi :", e.target.value)

        if (e.target.value > maxAmount) {
            Swal.fire({
                icon: "info",
                text: `Le montant du financement est : ${maxAmount} FCFA`
            })
            e.target.value = maxAmount
            return
        }


        setData("montant", e.target.value)
    }

    const submit = (e) => {
        e.preventDefault();

        patch(route('backfinancement.update',backfinancement.id), {
            onStart: () => {
                Swal.fire({
                    title: '<span style="color: #facc15;">🫠 Opération en cours...</span>', // yellow text
                    text: 'Veuillez patienter pendant que nous traitons vos données.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
            },
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #2a7348;">👌Opération réussie </span>',
                    text: 'Opération réussie',
                    confirmButtonText: '😇 Fermer'
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #facc15;">🤦‍♂️ Opération échouée </span>', // yellow text
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                    confirmButtonText: '😇 Fermer'
                });
                console.log(e);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cibAddthis} /> Ajout des retour de financements
                </h2>
            }
        >
            <Head title="Ajouter un retour de financement" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('backfinancement.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("backfinancement.index")}> <CIcon icon={cilList} /> Liste des retour des financements</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <InputLabel htmlFor="financement_id" value="Financement" >  <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher un financement ..."
                                                name="financement_id"
                                                id="financement_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={financements.data.map((financement) => ({
                                                    value: financement.id,
                                                    label: `${financement.reference}`,
                                                }))}
                                                value={financements.data
                                                    .map((financement) => ({
                                                        value: financement.id,
                                                        label: `${financement.reference}`,
                                                    }))
                                                    .find((option) => option.value === data.financement_id)} // set selected option
                                                onChange={(option) => changeFinancement(option)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.financement_id} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="montant" value="Le montant" >  <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                type="number"
                                                id="montant"
                                                className="mt-1 block w-full"
                                                value={data.montant}
                                                placeholder="Ex: 234567"
                                                onChange={(e) => changeAmount(e)}
                                                autoComplete="montant"
                                                min={1}
                                                max={maxAmount}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.montant} />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="document" value="Document(preuve)" > </InputLabel>
                                            <TextInput
                                                id="document"
                                                type="file"
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('document', e.target.files[0])}
                                                autoComplete="document"
                                            />

                                            <InputError className="mt-2" message={errors.document} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}> <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer'} </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
