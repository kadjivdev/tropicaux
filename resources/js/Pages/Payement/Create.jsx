import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilArrowCircleLeft, cilLibraryAdd } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'

export default function Create({ apprenants, schools }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {
        data,
        setData,
        errors,
        post,
        processing,
        progress
    } = useForm({
        school_id: "",
        apprenant_id: "",
        montant: "",
        paiement_receit: "",
    });

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('paiement.store'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Paiement créée avec succès',
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                });
                console.log(e);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilLibraryAdd} /> Nouvelle inscription
                </h2>
            }
        >
            <Head title="Nouveau paiement" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">
                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('paiement.view') ?
                                (<div className="text-center items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("paiement.index")}>
                                        <CIcon icon={cilArrowCircleLeft} /> Liste des paiements
                                    </Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        {/* École */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="school_id" value="École concernée" > <span className="text-danger">*</span> </InputLabel>

                                            <Select
                                                placeholder="Rechercher une école ..."
                                                name="school_id"
                                                id="school_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={schools.map((school) => ({
                                                    value: school.id,
                                                    label: `${school.raison_sociale}`,
                                                }))}
                                                value={schools
                                                    .map((school) => ({
                                                        value: school.id,
                                                        label: `${school.raison_sociale}`,
                                                    }))
                                                    .find((option) => option.value === data.school_id)} // set selected option
                                                onChange={(option) => setData('school_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.school_id} />
                                        </div>


                                        {/* Montant */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="montant" value="Montant versé" ><span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="montant"
                                                type="number"
                                                className="mt-1 block w-full"
                                                placeholder="50000"
                                                value={data.montant}
                                                onChange={(e) => setData('montant', e.target.value)}
                                                autoComplete="montant"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.montant} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Apprenant */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="apprenant_id" value="Apprenant concerné" > <span className="text-danger">*</span> </InputLabel>

                                            <Select
                                                placeholder="Rechercher un apprenant ..."
                                                name="apprenant_id"
                                                id="apprenant_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={apprenants.map((apprenant) => ({
                                                    value: apprenant.id,
                                                    label: `${apprenant.firstname} - ${apprenant.lastname}`,
                                                }))}
                                                value={apprenants
                                                    .map((apprenant) => ({
                                                        value: apprenant.id,
                                                        label: `${apprenant.firstname} - ${apprenant.lastname}`,
                                                    }))
                                                    .find((option) => option.value === data.apprenant_id)} // set selected option
                                                onChange={(option) => setData('apprenant_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.apprenant_id} />
                                        </div>

                                        {/* Recu de paiement */}
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="paiement_receit" value="Reçu du paiement" ></InputLabel>
                                            <TextInput
                                                id="paiement_receit"
                                                type="file"
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('paiement_receit', e.target.files[0])}
                                                autoComplete="paiement_receit"
                                            />

                                            {progress && (
                                                <progress value={progress.percentage} max="100">
                                                    {progress.percentage}%
                                                </progress>
                                            )}

                                            <InputError className="mt-2" message={errors.paiement_receit} />
                                        </div>

                                    </div>
                                </div>

                                {/* Bouton */}
                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
