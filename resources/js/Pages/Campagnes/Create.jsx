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
import { Textarea } from '@headlessui/react';

export default function Create({ }) {
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
    } = useForm({
        libelle: "",
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('campagne.store'), {
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

    // 
    const handleName = (e) => {
        e.preventDefault();

        if (e.target.value.length > 20) {
            Swal.fire({
                icon: "info",
                text: "Le nombre de caractère ne doit pas dépasser 50!"
            })
            e.target.value =null
        }

        setData("libelle",e.target.value)
    }

    return (
        <AuthenticatedLayout
            menu={false}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cibAddthis} /> Ajout des campagnes
                </h2>
            }
        >
            <Head title="Ajouter une campgane" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('financement.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("campagne.index")}> <CIcon icon={cilList} /> Liste des campagnes</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="libelle" value="Le nom ou libelé de la campagne" >  <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                type="text"
                                                id="libelle"
                                                className="mt-1 block w-full"
                                                value={data.libelle}
                                                placeholder="Ex: Campagne du mois de Novembre..."
                                                onChange={(e) => handleName(e)}
                                                autoComplete="libelle"
                                                min={1}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.libelle} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="description" value="La description de la campagne" > <span className="text-danger">*</span> </InputLabel>
                                            <Textarea
                                                type="text"
                                                id="description"
                                                className="mt-1 form-control block w-full"
                                                value={data.description}
                                                placeholder="Ex: Une campagne lancée pour le beure de Karité"
                                                onChange={(e) => setData('description', e.target.value)}
                                                autoComplete="description"
                                                rows={2}
                                            />
                                            <InputError className="mt-2" message={errors.description} />
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
